import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { BedSize } from "../../../common/enums/BedSize";
import { BedModel } from "../../../common/models/BedModel";
import { BedViewModel } from "../../../common/models/BedViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { MediaProvider } from "../../../common/providers/MediaProvider";
import { BedQueries } from "../../../common/queries/BedQueries";
import { BedViewQueries } from "../../../common/queries/BedViewQueries";

export class MyBedsProvider implements IProvider {
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

  public async getMyBeds(accountId: number): Promise<ProviderResponse<BedViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(BedViewQueries.GET_BEDS_$ACID, [accountId]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(BedViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyBed(
    accountId: number,
    bedId: number,
  ): Promise<ProviderResponse<BedViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const myBed = await this.partialGetMyBed(accountId, bedId);
      if (myBed === null) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(myBed);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createBed(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    bedSize: BedSize | null,
  ): Promise<ProviderResponse<BedViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateItem(accountId, name, description);
      const bed = await this.partialCreateBed(item.itemId, bedSize);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const bedView = await this.partialGetMyBed(accountId, bed.bedId);
      if (bedView === null) {
        throw new UnexpectedDatabaseStateError("Bed was not created");
      }
      return await ResponseUtil.providerResponse(bedView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateBed(
    accountId: number,
    oldMediaIds: number[],
    bedId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    bedSize: BedSize | null,
  ): Promise<ProviderResponse<BedViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateBed(bedId, bedSize);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const bedView = await this.partialGetMyBed(accountId, bedId);
      if (bedView === null) {
        throw new UnexpectedDatabaseStateError("Bed was not updated");
      }
      return await ResponseUtil.providerResponse(bedView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteBed(
    itemId: number,
    bedId: number,
    mediaIds: number[],
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteBed(bedId);
      await this.partialDeleteItemMedias(itemId, mediaIds);
      await this.partialDeleteItem(itemId);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialCreateBed(itemId: number, bedSize: BedSize | null): Promise<BedModel> {
    const results = await DbConstants.POOL.query(BedQueries.INSERT_BED_RT_$ITID_$BDSZ, [
      itemId,
      bedSize,
    ]);
    const record: unknown = results.rows[0];
    return BedModel.fromRecord(record);
  }

  private async partialUpdateBed(bedId: number, bedSize: BedSize | null): Promise<BedModel> {
    const results = await DbConstants.POOL.query(BedQueries.UPDATE_BED_RT_$BDID_$BDSZ, [
      bedId,
      bedSize,
    ]);
    const record: unknown = results.rows[0];
    return BedModel.fromRecord(record);
  }

  private async partialDeleteBed(bedId: number): Promise<void> {
    await DbConstants.POOL.query(BedQueries.DELETE_BED_$BDID, [bedId]);
  }

  private async partialGetMyBed(accountId: number, bedId: number): Promise<BedViewModel | null> {
    const results = await DbConstants.POOL.query(BedViewQueries.GET_BED_$ACID_$BDID, [
      accountId,
      bedId,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return BedViewModel.fromRecord(record);
  }
}
