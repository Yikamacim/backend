import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { ItemMediaViewModel } from "../models/ItemMediaViewModel";
import { ItemMediaQueries } from "../queries/ItemMediaQueries";
import { ItemMediaViewQueries } from "../queries/ItemMediaViewQueries";

export class ItemMediaProvider implements IProvider {
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

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  public async partialCreateItemMedias(itemId: number, mediaIds: number[]): Promise<void> {
    for (const mediaId of mediaIds) {
      await DbConstants.POOL.query(ItemMediaQueries.INSERT_ITEM_MEDIA_$ITID_$MDID, [
        itemId,
        mediaId,
      ]);
    }
  }

  public async partialDeleteItemMedias(itemId: number, mediaIds: number[]): Promise<void> {
    for (const mediaId of mediaIds) {
      await DbConstants.POOL.query(ItemMediaQueries.DELETE_ITEM_MEDIA_$ITID_$MDID, [
        itemId,
        mediaId,
      ]);
    }
  }
}
