import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { MediaModel } from "../models/MediaModel";
import { MediaQueries } from "../queries/MediaQueries";

export class MediaProvider implements IProvider {
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

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  public async partialUpdateMedias(mediaIds: number[], isUsed: boolean): Promise<void> {
    for (const mediaId of mediaIds) {
      await DbConstants.POOL.query(MediaQueries.UPDATE_MEDIA_$MDID_$ISUS, [mediaId, isUsed]);
    }
  }
}
