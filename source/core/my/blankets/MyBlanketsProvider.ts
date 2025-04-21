import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { BlanketMaterial } from "../../../common/enums/BlanketMaterial";
import type { BlanketSize } from "../../../common/enums/BlanketSize";
import { BlanketModel } from "../../../common/models/BlanketModel";
import { BlanketViewModel } from "../../../common/models/BlanketViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { MediaProvider } from "../../../common/providers/MediaProvider";
import { BlanketQueries } from "../../../common/queries/BlanketQueries";
import { BlanketViewQueries } from "../../../common/queries/BlanketViewQueries";

export class MyBlanketsProvider implements IProvider {
  public constructor(
    private readonly itemProvider = new ItemProvider(),
    private readonly itemMediaProvider = new ItemMediaProvider(),
    private readonly mediaProvider = new MediaProvider(),
  ) {
    this.partialCreateItem = this.itemProvider.partialCreateItem.bind(this.itemProvider);
    this.partialUpdateItem = this.itemProvider.partialUpdateItem.bind(this.itemProvider);
    this.partialDeleteItem = this.itemProvider.partialDeleteItem.bind(this.itemProvider);
    this.getItemMedias = this.itemMediaProvider.getItemMedias.bind(this.itemMediaProvider);
    this.partialCreateItemMedias = this.itemMediaProvider.partialCreateItemMedias.bind(
      this.itemMediaProvider,
    );
    this.partialDeleteItemMedias = this.itemMediaProvider.partialDeleteItemMedias.bind(
      this.itemMediaProvider,
    );
    this.getMyMedias = this.mediaProvider.getMyMedias.bind(this.mediaProvider);
  }

  public partialCreateItem: typeof this.itemProvider.partialCreateItem;
  public partialUpdateItem: typeof this.itemProvider.partialUpdateItem;
  public partialDeleteItem: typeof this.itemProvider.partialDeleteItem;
  public getItemMedias: typeof this.itemMediaProvider.getItemMedias;
  public partialCreateItemMedias: typeof this.itemMediaProvider.partialCreateItemMedias;
  public partialDeleteItemMedias: typeof this.itemMediaProvider.partialDeleteItemMedias;
  public getMyMedias: typeof this.mediaProvider.getMyMedias;

  public async getMyBlankets(accountId: number): Promise<ProviderResponse<BlanketViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(BlanketViewQueries.GET_BLANKETS_$ACID, [
        accountId,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(BlanketViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyBlanket(
    accountId: number,
    blanketId: number,
  ): Promise<ProviderResponse<BlanketViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      return await ResponseUtil.providerResponse(
        await this.partialGetMyBlanket(accountId, blanketId),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createBlanket(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    blanketSize: BlanketSize | null,
    blanketMaterial: BlanketMaterial | null,
  ): Promise<ProviderResponse<BlanketViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateItem(accountId, name, description);
      const blanket = await this.partialCreateBlanket(item.itemId, blanketSize, blanketMaterial);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const blanketView = await this.partialGetMyBlanket(accountId, blanket.blanketId);
      if (blanketView === null) {
        throw new UnexpectedDatabaseStateError("Blanket was not created");
      }
      return await ResponseUtil.providerResponse(blanketView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateBlanket(
    accountId: number,
    oldMediaIds: number[],
    blanketId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    blanketSize: BlanketSize | null,
    blanketMaterial: BlanketMaterial | null,
  ): Promise<ProviderResponse<BlanketViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateBlanket(blanketId, blanketSize, blanketMaterial);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const blanketView = await this.partialGetMyBlanket(accountId, blanketId);
      if (blanketView === null) {
        throw new UnexpectedDatabaseStateError("Blanket was not updated");
      }
      return await ResponseUtil.providerResponse(blanketView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteBlanket(
    itemId: number,
    blanketId: number,
    mediaIds: number[],
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteBlanket(blanketId);
      await this.partialDeleteItemMedias(itemId, mediaIds);
      await this.partialDeleteItem(itemId);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetMyBlanket(
    accountId: number,
    blanketId: number,
  ): Promise<BlanketViewModel | null> {
    const results = await DbConstants.POOL.query(BlanketViewQueries.GET_BLANKET_$ACID_$BLID, [
      accountId,
      blanketId,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return BlanketViewModel.fromRecord(record);
  }

  private async partialCreateBlanket(
    itemId: number,
    blanketSize: BlanketSize | null,
    blanketMaterial: BlanketMaterial | null,
  ): Promise<BlanketModel> {
    const results = await DbConstants.POOL.query(
      BlanketQueries.INSERT_BLANKET_RT_$ITID_$QLSZ_$QMAT,
      [itemId, blanketSize, blanketMaterial],
    );
    const record: unknown = results.rows[0];
    return BlanketModel.fromRecord(record);
  }

  private async partialUpdateBlanket(
    blanketId: number,
    blanketSize: BlanketSize | null,
    blanketMaterial: BlanketMaterial | null,
  ): Promise<BlanketModel> {
    const results = await DbConstants.POOL.query(
      BlanketQueries.UPDATE_BLANKET_RT_$BLID_$BLSZ_$BMAT,
      [blanketId, blanketSize, blanketMaterial],
    );
    const record: unknown = results.rows[0];
    return BlanketModel.fromRecord(record);
  }

  private async partialDeleteBlanket(blanketId: number): Promise<void> {
    await DbConstants.POOL.query(BlanketQueries.DELETE_BLANKET_$BLID, [blanketId]);
  }
}
