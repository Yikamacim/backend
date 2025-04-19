import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { CarpetMaterial } from "../../../common/enums/CarpetMaterial";
import { CarpetModel } from "../../../common/models/CarpetModel";
import { CarpetViewModel } from "../../../common/models/CarpetViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { MediaProvider } from "../../../common/providers/MediaProvider";
import { CarpetQueries } from "../../../common/queries/CarpetQueries";
import { CarpetViewQueries } from "../../../common/queries/CarpetViewQueries";

export class MyCarpetsProvider implements IProvider {
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

  public async getMyCarpets(accountId: number): Promise<ProviderResponse<CarpetViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CarpetViewQueries.GET_CARPETS_$ACID, [
        accountId,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(CarpetViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyCarpet(
    accountId: number,
    carpetId: number,
  ): Promise<ProviderResponse<CarpetViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const myCarpet = await this.partialGetMyCarpet(accountId, carpetId);
      if (myCarpet === null) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(myCarpet);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createCarpet(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    width: number | null,
    length: number | null,
    carpetMaterial: CarpetMaterial | null,
  ): Promise<ProviderResponse<CarpetViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateItem(accountId, name, description);
      const carpet = await this.partialCreateCarpet(item.itemId, width, length, carpetMaterial);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const carpetView = await this.partialGetMyCarpet(accountId, carpet.carpetId);
      if (carpetView === null) {
        throw new UnexpectedDatabaseStateError("Carpet was not created");
      }
      return await ResponseUtil.providerResponse(carpetView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateCarpet(
    accountId: number,
    oldMediaIds: number[],
    carpetId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    width: number | null,
    length: number | null,
    carpetMaterial: CarpetMaterial | null,
  ): Promise<ProviderResponse<CarpetViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateCarpet(carpetId, width, length, carpetMaterial);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const carpetView = await this.partialGetMyCarpet(accountId, carpetId);
      if (carpetView === null) {
        throw new UnexpectedDatabaseStateError("Carpet was not updated");
      }
      return await ResponseUtil.providerResponse(carpetView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteCarpet(
    itemId: number,
    carpetId: number,
    mediaIds: number[],
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteCarpet(carpetId);
      await this.partialDeleteItemMedias(itemId, mediaIds);
      await this.partialDeleteItem(itemId);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialCreateCarpet(
    itemId: number,
    width: number | null,
    length: number | null,
    carpetMaterial: CarpetMaterial | null,
  ): Promise<CarpetModel> {
    const results = await DbConstants.POOL.query(
      CarpetQueries.INSERT_CARPET_RT_$ITID_$WIDTH_$LENGTH_$CMAT,
      [itemId, width, length, carpetMaterial],
    );
    const record: unknown = results.rows[0];
    return CarpetModel.fromRecord(record);
  }

  private async partialUpdateCarpet(
    carpetId: number,
    width: number | null,
    length: number | null,
    carpetMaterial: CarpetMaterial | null,
  ): Promise<CarpetModel> {
    const results = await DbConstants.POOL.query(
      CarpetQueries.UPDATE_CARPET_RT_$CPID_$WIDTH_$LENGTH_$CMAT,
      [carpetId, width, length, carpetMaterial],
    );
    const record: unknown = results.rows[0];
    return CarpetModel.fromRecord(record);
  }

  private async partialDeleteCarpet(carpetId: number): Promise<void> {
    await DbConstants.POOL.query(CarpetQueries.DELETE_CARPET_$CPID, [carpetId]);
  }

  private async partialGetMyCarpet(
    accountId: number,
    carpetId: number,
  ): Promise<CarpetViewModel | null> {
    const results = await DbConstants.POOL.query(CarpetViewQueries.GET_CARPET_$ACID_$CPID, [
      accountId,
      carpetId,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return CarpetViewModel.fromRecord(record);
  }
}
