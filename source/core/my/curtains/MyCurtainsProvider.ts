import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { CurtainType } from "../../../common/enums/CurtainType";
import { CurtainModel } from "../../../common/models/CurtainModel";
import { CurtainViewModel } from "../../../common/models/CurtainViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { MediaProvider } from "../../../common/providers/MediaProvider";
import { CurtainQueries } from "../../../common/queries/CurtainQueries";
import { CurtainViewQueries } from "../../../common/queries/CurtainViewQueries";

export class MyCurtainsProvider implements IProvider {
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

  public async getMyCurtains(accountId: number): Promise<ProviderResponse<CurtainViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CurtainViewQueries.GET_CURTAINS_$ACID, [
        accountId,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(CurtainViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyCurtain(
    accountId: number,
    curtainId: number,
  ): Promise<ProviderResponse<CurtainViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      return await ResponseUtil.providerResponse(
        await this.partialGetMyCurtain(accountId, curtainId),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createCurtain(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    width: number | null,
    length: number | null,
    curtainType: CurtainType | null,
  ): Promise<ProviderResponse<CurtainViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateItem(accountId, name, description);
      const curtain = await this.partialCreateCurtain(item.itemId, width, length, curtainType);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const curtainView = await this.partialGetMyCurtain(accountId, curtain.curtainId);
      if (curtainView === null) {
        throw new UnexpectedDatabaseStateError("Curtain was not created");
      }
      return await ResponseUtil.providerResponse(curtainView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateCurtain(
    accountId: number,
    oldMediaIds: number[],
    carpetId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    width: number | null,
    length: number | null,
    curtainType: CurtainType | null,
  ): Promise<ProviderResponse<CurtainViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateCurtain(carpetId, width, length, curtainType);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const curtainView = await this.partialGetMyCurtain(accountId, carpetId);
      if (curtainView === null) {
        throw new UnexpectedDatabaseStateError("Curtain was not updated");
      }
      return await ResponseUtil.providerResponse(curtainView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteCurtain(
    itemId: number,
    curtainId: number,
    mediaIds: number[],
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteCurtain(curtainId);
      await this.partialDeleteItemMedias(itemId, mediaIds);
      await this.partialDeleteItem(itemId);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetMyCurtain(
    accountId: number,
    curtainId: number,
  ): Promise<CurtainViewModel | null> {
    const results = await DbConstants.POOL.query(CurtainViewQueries.GET_CURTAIN_$ACID_$CRID, [
      accountId,
      curtainId,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return CurtainViewModel.fromRecord(record);
  }

  private async partialCreateCurtain(
    itemId: number,
    width: number | null,
    length: number | null,
    curtainType: CurtainType | null,
  ): Promise<CurtainModel> {
    const results = await DbConstants.POOL.query(
      CurtainQueries.INSERT_CURTAIN_RT_$ITID_$WIDTH_$LENGTH_$CTYP,
      [itemId, width, length, curtainType],
    );
    const record: unknown = results.rows[0];
    return CurtainModel.fromRecord(record);
  }

  private async partialUpdateCurtain(
    curtainId: number,
    width: number | null,
    length: number | null,
    curtainType: CurtainType | null,
  ): Promise<CurtainModel> {
    const results = await DbConstants.POOL.query(
      CurtainQueries.UPDATE_CURTAIN_RT_$CPID_$WIDTH_$LENGTH_$CTYP,
      [curtainId, width, length, curtainType],
    );
    const record: unknown = results.rows[0];
    return CurtainModel.fromRecord(record);
  }

  private async partialDeleteCurtain(curtainId: number): Promise<void> {
    await DbConstants.POOL.query(CurtainQueries.DELETE_CURTAIN_$CRID, [curtainId]);
  }
}
