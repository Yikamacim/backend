import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { ESofaMaterial } from "../../../common/enums/ESofaMaterial";
import type { ESofaType } from "../../../common/enums/ESofaType";
import { SofaModel } from "../../../common/models/SofaModel";
import { SofaViewModel } from "../../../common/models/SofaViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { SofaQueries } from "../../../common/queries/SofaQueries";
import { SofaViewQueries } from "../../../common/queries/SofaViewQueries";

export class MySofasProvider implements IProvider {
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

  public async getMyActiveSofas(accountId: number): Promise<ProviderResponse<SofaViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(SofaViewQueries.GET_SOFAS_$ACID_$ISDEL, [
        accountId,
        false,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(SofaViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyActiveSofa(
    accountId: number,
    sofaId: number,
  ): Promise<ProviderResponse<SofaViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(SofaViewQueries.GET_SOFA_$ACID_$SFID_$ISDEL, [
        accountId,
        sofaId,
        false,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return SofaViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createMySofa(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    isCushioned: boolean | null,
    sofaType: ESofaType | null,
    sofaMaterial: ESofaMaterial | null,
  ): Promise<ProviderResponse<SofaViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateMyItem(accountId, name, description);
      const sofa = await this.partialCreateSofa(item.itemId, isCushioned, sofaType, sofaMaterial);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const sofaView = await this.partialGetActiveSofa(sofa.sofaId);
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
    oldMediaIds: number[],
    sofaId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    isCushioned: boolean | null,
    sofaType: ESofaType | null,
    sofaMaterial: ESofaMaterial | null,
  ): Promise<ProviderResponse<SofaViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateSofa(sofaId, isCushioned, sofaType, sofaMaterial);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const sofaView = await this.partialGetActiveSofa(sofaId);
      if (sofaView === null) {
        throw new UnexpectedDatabaseStateError("Sofa was not updated");
      }
      return await ResponseUtil.providerResponse(sofaView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetActiveSofa(sofaId: number): Promise<SofaViewModel | null> {
    const results = await DbConstants.POOL.query(SofaViewQueries.GET_SOFA_$SFID_$ISDEL, [
      sofaId,
      false,
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
    sofaType: ESofaType | null,
    sofaMaterial: ESofaMaterial | null,
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
    sofaType: ESofaType | null,
    sofaMaterial: ESofaMaterial | null,
  ): Promise<SofaModel> {
    const results = await DbConstants.POOL.query(
      SofaQueries.UPDATE_SOFA_RT_$SFID_$ISCH_$SFTP_$SMAT,
      [sofaId, isCushioned, sofaType, sofaMaterial],
    );
    const record: unknown = results.rows[0];
    return SofaModel.fromRecord(record);
  }
}
