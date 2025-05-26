import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { EBedSize } from "../../../common/enums/EBedSize";
import { BedModel } from "../../../common/models/BedModel";
import { BedViewModel } from "../../../common/models/BedViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { BedQueries } from "../../../common/queries/BedQueries";
import { BedViewQueries } from "../../../common/queries/BedViewQueries";

export class MyBedsProvider implements IProvider {
  public constructor(
    private readonly itemProvider = new ItemProvider(),
    private readonly itemMediaProvider = new ItemMediaProvider(),
  ) {
    this.partialCreateMyItem = this.itemProvider.partialCreateMyItem.bind(this.itemProvider);
    this.partialUpdateItem = this.itemProvider.partialUpdateItem.bind(this.itemProvider);
    this.archiveItem = this.itemProvider.archiveItem.bind(this.itemProvider);
    this.getItemMedias = this.itemMediaProvider.getItemMedias.bind(this.itemMediaProvider);
    this.partialCreateItemMedias = this.itemMediaProvider.partialCreateItemMedias.bind(
      this.itemMediaProvider,
    );
    this.partialDeleteItemMedias = this.itemMediaProvider.partialDeleteItemMedias.bind(
      this.itemMediaProvider,
    );
  }

  public readonly getItemMedias: typeof this.itemMediaProvider.getItemMedias;
  public readonly archiveItem: typeof this.itemProvider.archiveItem;

  private readonly partialCreateMyItem: typeof this.itemProvider.partialCreateMyItem;
  private readonly partialUpdateItem: typeof this.itemProvider.partialUpdateItem;
  private readonly partialCreateItemMedias: typeof this.itemMediaProvider.partialCreateItemMedias;
  private readonly partialDeleteItemMedias: typeof this.itemMediaProvider.partialDeleteItemMedias;

  public async getMyActiveBeds(accountId: number): Promise<ProviderResponse<BedViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(BedViewQueries.GET_BEDS_$ACID_$ISDEL, [
        accountId,
        false,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(BedViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyActiveBed(
    accountId: number,
    bedId: number,
  ): Promise<ProviderResponse<BedViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(BedViewQueries.GET_BED_$ACID_$BDID_$ISDEL, [
        accountId,
        bedId,
        false,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return BedViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createMyBed(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    bedSize: EBedSize | null,
  ): Promise<ProviderResponse<BedViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateMyItem(accountId, name, description);
      const bed = await this.partialCreateBed(item.itemId, bedSize);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const bedView = await this.partialGetActiveBed(bed.bedId);
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
    oldMediaIds: number[],
    bedId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    bedSize: EBedSize | null,
  ): Promise<ProviderResponse<BedViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateBed(bedId, bedSize);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const bedView = await this.partialGetActiveBed(bedId);
      if (bedView === null) {
        throw new UnexpectedDatabaseStateError("Bed was not updated");
      }
      return await ResponseUtil.providerResponse(bedView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetActiveBed(bedId: number): Promise<BedViewModel | null> {
    const results = await DbConstants.POOL.query(BedViewQueries.GET_BED_$BDID_$ISDEL, [
      bedId,
      false,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return BedViewModel.fromRecord(record);
  }

  private async partialCreateBed(itemId: number, bedSize: EBedSize | null): Promise<BedModel> {
    const results = await DbConstants.POOL.query(BedQueries.INSERT_BED_RT_$ITID_$BDSZ, [
      itemId,
      bedSize,
    ]);
    const record: unknown = results.rows[0];
    return BedModel.fromRecord(record);
  }

  private async partialUpdateBed(bedId: number, bedSize: EBedSize | null): Promise<BedModel> {
    const results = await DbConstants.POOL.query(BedQueries.UPDATE_BED_RT_$BDID_$BDSZ, [
      bedId,
      bedSize,
    ]);
    const record: unknown = results.rows[0];
    return BedModel.fromRecord(record);
  }
}
