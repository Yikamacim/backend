import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { CarpetMaterial } from "../../../common/enums/CarpetMaterial";
import { CarpetModel } from "../../../common/models/CarpetModel";
import { CarpetViewModel } from "../../../common/models/CarpetViewModel";
import { ItemMediaViewModel } from "../../../common/models/ItemMediaViewModel";
import { ItemModel } from "../../../common/models/ItemModel";
import { MediaModel } from "../../../common/models/MediaModel";
import { CarpetQueries } from "../../../common/queries/CarpetQueries";
import { CarpetViewQueries } from "../../../common/queries/CarpetViewQueries";
import { ItemMediaQueries } from "../../../common/queries/ItemMediaQueries";
import { ItemMediaViewQueries } from "../../../common/queries/ItemMediaViewQueries";
import { ItemQueries } from "../../../common/queries/ItemQueries";
import { MediaQueries } from "../../../common/queries/MediaQueries";

export class MyCarpetsProvider implements IProvider {
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
      const results = await DbConstants.POOL.query(CarpetViewQueries.GET_CARPET_$ACID_$CPID, [
        accountId,
        carpetId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(CarpetViewModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getItemMedias(itemId: number): Promise<ProviderResponse<ItemMediaViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ItemMediaViewQueries.GET_ITEM_MEDIAS_$ITID, [
        itemId,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(ItemMediaViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyMedias(accountId: number): Promise<ProviderResponse<MediaModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(MediaQueries.GET_MEDIAS_$ACID_$ISUS, [
        accountId,
        false,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(MediaModel.fromRecords(records));
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
      await this.partialUpdateMediasIsUsed(mediaIds, true);
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
      await this.partialUpdateMediasIsUsed(oldMediaIds, false);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateCarpet(carpetId, width, length, carpetMaterial);
      await this.partialCreateItemMedias(itemId, mediaIds);
      await this.partialUpdateMediasIsUsed(mediaIds, true);
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
      await this.partialUpdateMediasIsUsed(mediaIds, false);
      await this.partialDeleteItem(itemId);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialCreateItem(
    accountId: number,
    name: string,
    description: string,
  ): Promise<ItemModel> {
    const results = await DbConstants.POOL.query(ItemQueries.INSERT_ITEM_RT_$ACID_$NAME_$DESC, [
      accountId,
      name,
      description,
    ]);
    const record: unknown = results.rows[0];
    return ItemModel.fromRecord(record);
  }

  private async partialUpdateItem(
    itemId: number,
    name: string,
    description: string,
  ): Promise<void> {
    await DbConstants.POOL.query(ItemQueries.UPDATE_ITEM_RT_$ITID_$NAME_$DESC, [
      itemId,
      name,
      description,
    ]);
  }

  private async partialDeleteItem(itemId: number): Promise<void> {
    await DbConstants.POOL.query(ItemQueries.DELETE_ITEM_$ITID, [itemId]);
  }

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

  private async partialDeleteCarpet(carpetId: number): Promise<void> {
    await DbConstants.POOL.query(CarpetQueries.DELETE_CARPET_$CPID, [carpetId]);
  }

  private async partialCreateItemMedias(itemId: number, mediaIds: number[]): Promise<void> {
    for (const mediaId of mediaIds) {
      await DbConstants.POOL.query(ItemMediaQueries.INSERT_ITEM_MEDIA_RT_$ITID_$MDID, [
        itemId,
        mediaId,
      ]);
    }
  }

  private async partialDeleteItemMedias(itemId: number, mediaIds: number[]): Promise<void> {
    for (const mediaId of mediaIds) {
      await DbConstants.POOL.query(ItemMediaQueries.DELETE_ITEM_MEDIA_$ITID_$MDID, [
        itemId,
        mediaId,
      ]);
    }
  }

  private async partialUpdateMediasIsUsed(mediaIds: number[], isUsed: boolean): Promise<void> {
    for (const mediaId of mediaIds) {
      await DbConstants.POOL.query(MediaQueries.UPDATE_MEDIA_RT_$MDID_$ISUS, [mediaId, isUsed]);
    }
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
