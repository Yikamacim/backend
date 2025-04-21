import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { SofaMaterial } from "../../../common/enums/SofaMaterial";
import type { SofaType } from "../../../common/enums/SofaType";
import { SofaModel } from "../../../common/models/SofaModel";
import { SofaViewModel } from "../../../common/models/SofaViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { MediaProvider } from "../../../common/providers/MediaProvider";
import { SofaQueries } from "../../../common/queries/SofaQueries";
import { SofaViewQueries } from "../../../common/queries/SofaViewQueries";

export class MySofasProvider implements IProvider {
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

  public async getMySofas(accountId: number): Promise<ProviderResponse<SofaViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(SofaViewQueries.GET_SOFAS_$ACID, [accountId]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(SofaViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMySofa(
    accountId: number,
    sofaId: number,
  ): Promise<ProviderResponse<SofaViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      return await ResponseUtil.providerResponse(await this.partialGetMySofa(accountId, sofaId));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createSofa(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    isCushioned: boolean | null,
    sofaType: SofaType | null,
    sofaMaterial: SofaMaterial | null,
  ): Promise<ProviderResponse<SofaViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateItem(accountId, name, description);
      const sofa = await this.partialCreateSofa(item.itemId, isCushioned, sofaType, sofaMaterial);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const sofaView = await this.partialGetMySofa(accountId, sofa.sofaId);
      if (sofaView === null) {
        throw new UnexpectedDatabaseStateError("Sofa was not created");
      }
      return await ResponseUtil.providerResponse(sofaView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateSofa(
    accountId: number,
    oldMediaIds: number[],
    sofaId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    isCushioned: boolean | null,
    sofaType: SofaType | null,
    sofaMaterial: SofaMaterial | null,
  ): Promise<ProviderResponse<SofaViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateSofa(sofaId, isCushioned, sofaType, sofaMaterial);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const sofaView = await this.partialGetMySofa(accountId, sofaId);
      if (sofaView === null) {
        throw new UnexpectedDatabaseStateError("Sofa was not updated");
      }
      return await ResponseUtil.providerResponse(sofaView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteSofa(
    itemId: number,
    sofaId: number,
    mediaIds: number[],
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteSofa(sofaId);
      await this.partialDeleteItemMedias(itemId, mediaIds);
      await this.partialDeleteItem(itemId);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetMySofa(accountId: number, sofaId: number): Promise<SofaViewModel | null> {
    const results = await DbConstants.POOL.query(SofaViewQueries.GET_SOFA_$ACID_$SFID, [
      accountId,
      sofaId,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return SofaViewModel.fromRecord(record);
  }

  private async partialCreateSofa(
    itemId: number,
    isCushioned: boolean | null,
    sofaType: SofaType | null,
    sofaMaterial: SofaMaterial | null,
  ): Promise<SofaModel> {
    const results = await DbConstants.POOL.query(
      SofaQueries.INSERT_SOFA_RT_$ITID_$ISCH_$SFTP_$SMAT,
      [itemId, isCushioned, sofaType, sofaMaterial],
    );
    const record: unknown = results.rows[0];
    return SofaModel.fromRecord(record);
  }

  private async partialUpdateSofa(
    sofaId: number,
    isCushioned: boolean | null,
    sofaType: SofaType | null,
    sofaMaterial: SofaMaterial | null,
  ): Promise<SofaModel> {
    const results = await DbConstants.POOL.query(
      SofaQueries.UPDATE_SOFA_RT_$SFID_$ISCH_$SFTP_$SMAT,
      [sofaId, isCushioned, sofaType, sofaMaterial],
    );
    const record: unknown = results.rows[0];
    return SofaModel.fromRecord(record);
  }

  private async partialDeleteSofa(sofaId: number): Promise<void> {
    await DbConstants.POOL.query(SofaQueries.DELETE_SOFA_$SFID, [sofaId]);
  }
}
