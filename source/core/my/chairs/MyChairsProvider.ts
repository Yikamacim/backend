import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { ChairModel } from "../../../common/models/ChairModel";
import { ChairViewModel } from "../../../common/models/ChairViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { MediaProvider } from "../../../common/providers/MediaProvider";
import { ChairQueries } from "../../../common/queries/ChairQueries";
import { ChairViewQueries } from "../../../common/queries/ChairViewQueries";

export class MyChairsProvider implements IProvider {
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
    this.getMyMedias = this.mediaProvider.getMyUnusedMedias.bind(this.mediaProvider);
  }

  public partialCreateItem: typeof this.itemProvider.partialCreateItem;
  public partialUpdateItem: typeof this.itemProvider.partialUpdateItem;
  public partialDeleteItem: typeof this.itemProvider.partialDeleteItem;
  public getItemMedias: typeof this.itemMediaProvider.getItemMedias;
  public partialCreateItemMedias: typeof this.itemMediaProvider.partialCreateItemMedias;
  public partialDeleteItemMedias: typeof this.itemMediaProvider.partialDeleteItemMedias;
  public getMyMedias: typeof this.mediaProvider.getMyUnusedMedias;

  public async getMyChairs(accountId: number): Promise<ProviderResponse<ChairViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ChairViewQueries.GET_CHAIRS_$ACID, [accountId]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(ChairViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyChair(
    accountId: number,
    chairId: number,
  ): Promise<ProviderResponse<ChairViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      return await ResponseUtil.providerResponse(await this.partialGetMyChair(accountId, chairId));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createChair(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    quantity: number,
  ): Promise<ProviderResponse<ChairViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateItem(accountId, name, description);
      const chair = await this.partialCreateChair(item.itemId, quantity);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const chairView = await this.partialGetMyChair(accountId, chair.chairId);
      if (chairView === null) {
        throw new UnexpectedDatabaseStateError("Chair was not created");
      }
      return await ResponseUtil.providerResponse(chairView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateChair(
    accountId: number,
    oldMediaIds: number[],
    chairId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    quantity: number,
  ): Promise<ProviderResponse<ChairViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateChair(chairId, quantity);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const chairView = await this.partialGetMyChair(accountId, chairId);
      if (chairView === null) {
        throw new UnexpectedDatabaseStateError("Chair was not updated");
      }
      return await ResponseUtil.providerResponse(chairView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteChair(
    itemId: number,
    chairId: number,
    mediaIds: number[],
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteChair(chairId);
      await this.partialDeleteItemMedias(itemId, mediaIds);
      await this.partialDeleteItem(itemId);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetMyChair(
    accountId: number,
    chairId: number,
  ): Promise<ChairViewModel | null> {
    const results = await DbConstants.POOL.query(ChairViewQueries.GET_CHAIR_$ACID_$SFID, [
      accountId,
      chairId,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return ChairViewModel.fromRecord(record);
  }

  private async partialCreateChair(itemId: number, quantity: number): Promise<ChairModel> {
    const results = await DbConstants.POOL.query(ChairQueries.INSERT_CHAIR_RT_$ITID_$QTTY, [
      itemId,
      quantity,
    ]);
    const record: unknown = results.rows[0];
    return ChairModel.fromRecord(record);
  }

  private async partialUpdateChair(chairId: number, quantity: number): Promise<ChairModel> {
    const results = await DbConstants.POOL.query(ChairQueries.UPDATE_CHAIR_RT_$CHID_$QTTY, [
      chairId,
      quantity,
    ]);
    const record: unknown = results.rows[0];
    return ChairModel.fromRecord(record);
  }

  private async partialDeleteChair(chairId: number): Promise<void> {
    await DbConstants.POOL.query(ChairQueries.DELETE_CHAIR_$CHID, [chairId]);
  }
}
