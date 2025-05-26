import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { EQuiltMaterial } from "../../../common/enums/EQuiltMaterial";
import type { EQuiltSize } from "../../../common/enums/EQuiltSize";
import { QuiltModel } from "../../../common/models/QuiltModel";
import { QuiltViewModel } from "../../../common/models/QuiltViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { QuiltQueries } from "../../../common/queries/QuiltQueries";
import { QuiltViewQueries } from "../../../common/queries/QuiltViewQueries";

export class MyQuiltsProvider implements IProvider {
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

  public async getMyActiveQuilts(accountId: number): Promise<ProviderResponse<QuiltViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(QuiltViewQueries.GET_QUILTS_$ACID_$ISDEL, [
        accountId,
        false,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(QuiltViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyActiveQuilt(
    accountId: number,
    quiltId: number,
  ): Promise<ProviderResponse<QuiltViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(QuiltViewQueries.GET_QUILT_$ACID_$QLID_$ISDEL, [
        accountId,
        quiltId,
        false,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return QuiltViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createMyQuilt(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    quiltSize: EQuiltSize | null,
    quiltMaterial: EQuiltMaterial | null,
  ): Promise<ProviderResponse<QuiltViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateMyItem(accountId, name, description);
      const quilt = await this.partialCreateQuilt(item.itemId, quiltSize, quiltMaterial);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const quiltView = await this.partialGetActiveQuilt(quilt.quiltId);
      if (quiltView === null) {
        throw new UnexpectedDatabaseStateError("Quilt was not created");
      }
      return await ResponseUtil.providerResponse(quiltView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateMyQuilt(
    oldMediaIds: number[],
    quiltId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    quiltSize: EQuiltSize | null,
    quiltMaterial: EQuiltMaterial | null,
  ): Promise<ProviderResponse<QuiltViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateQuilt(quiltId, quiltSize, quiltMaterial);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const quiltView = await this.partialGetActiveQuilt(quiltId);
      if (quiltView === null) {
        throw new UnexpectedDatabaseStateError("Quilt was not updated");
      }
      return await ResponseUtil.providerResponse(quiltView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetActiveQuilt(quiltId: number): Promise<QuiltViewModel | null> {
    const results = await DbConstants.POOL.query(QuiltViewQueries.GET_QUILT_$QLID_$ISDEL, [
      quiltId,
      false,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return QuiltViewModel.fromRecord(record);
  }

  private async partialCreateQuilt(
    itemId: number,
    quiltSize: EQuiltSize | null,
    quiltMaterial: EQuiltMaterial | null,
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
    quiltSize: EQuiltSize | null,
    quiltMaterial: EQuiltMaterial | null,
  ): Promise<QuiltModel> {
    const results = await DbConstants.POOL.query(QuiltQueries.UPDATE_QUILT_RT_$QLID_$QLSZ_$QMAT, [
      quiltId,
      quiltSize,
      quiltMaterial,
    ]);
    const record: unknown = results.rows[0];
    return QuiltModel.fromRecord(record);
  }
}
