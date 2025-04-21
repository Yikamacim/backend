import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { QuiltMaterial } from "../../../common/enums/QuiltMaterial";
import type { QuiltSize } from "../../../common/enums/QuiltSize";
import { QuiltModel } from "../../../common/models/QuiltModel";
import { QuiltViewModel } from "../../../common/models/QuiltViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { MediaProvider } from "../../../common/providers/MediaProvider";
import { QuiltQueries } from "../../../common/queries/QuiltQueries";
import { QuiltViewQueries } from "../../../common/queries/QuiltViewQueries";

export class MyQuiltsProvider implements IProvider {
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

  public async getMyQuilts(accountId: number): Promise<ProviderResponse<QuiltViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(QuiltViewQueries.GET_QUILTS_$ACID, [accountId]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(QuiltViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyQuilt(
    accountId: number,
    quiltId: number,
  ): Promise<ProviderResponse<QuiltViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      return await ResponseUtil.providerResponse(await this.partialGetMyQuilt(accountId, quiltId));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createQuilt(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    quiltSize: QuiltSize | null,
    quiltMaterial: QuiltMaterial | null,
  ): Promise<ProviderResponse<QuiltViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateItem(accountId, name, description);
      const quilt = await this.partialCreateQuilt(item.itemId, quiltSize, quiltMaterial);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const quiltView = await this.partialGetMyQuilt(accountId, quilt.quiltId);
      if (quiltView === null) {
        throw new UnexpectedDatabaseStateError("Quilt was not created");
      }
      return await ResponseUtil.providerResponse(quiltView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateQuilt(
    accountId: number,
    oldMediaIds: number[],
    quiltId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    quiltSize: QuiltSize | null,
    quiltMaterial: QuiltMaterial | null,
  ): Promise<ProviderResponse<QuiltViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateQuilt(quiltId, quiltSize, quiltMaterial);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const quiltView = await this.partialGetMyQuilt(accountId, quiltId);
      if (quiltView === null) {
        throw new UnexpectedDatabaseStateError("Quilt was not updated");
      }
      return await ResponseUtil.providerResponse(quiltView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteQuilt(
    itemId: number,
    quiltId: number,
    mediaIds: number[],
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteQuilt(quiltId);
      await this.partialDeleteItemMedias(itemId, mediaIds);
      await this.partialDeleteItem(itemId);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetMyQuilt(
    accountId: number,
    quiltId: number,
  ): Promise<QuiltViewModel | null> {
    const results = await DbConstants.POOL.query(QuiltViewQueries.GET_QUILT_$ACID_$QLID, [
      accountId,
      quiltId,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return QuiltViewModel.fromRecord(record);
  }

  private async partialCreateQuilt(
    itemId: number,
    quiltSize: QuiltSize | null,
    quiltMaterial: QuiltMaterial | null,
  ): Promise<QuiltModel> {
    const results = await DbConstants.POOL.query(QuiltQueries.INSERT_QUILT_RT_$ITID_$QLSZ_$QMAT, [
      itemId,
      quiltSize,
      quiltMaterial,
    ]);
    const record: unknown = results.rows[0];
    return QuiltModel.fromRecord(record);
  }

  private async partialUpdateQuilt(
    quiltId: number,
    quiltSize: QuiltSize | null,
    quiltMaterial: QuiltMaterial | null,
  ): Promise<QuiltModel> {
    const results = await DbConstants.POOL.query(QuiltQueries.UPDATE_QUILT_RT_$QLID_$QLSZ_$QMAT, [
      quiltId,
      quiltSize,
      quiltMaterial,
    ]);
    const record: unknown = results.rows[0];
    return QuiltModel.fromRecord(record);
  }

  private async partialDeleteQuilt(quiltId: number): Promise<void> {
    await DbConstants.POOL.query(QuiltQueries.DELETE_QUILT_$QLID, [quiltId]);
  }
}
