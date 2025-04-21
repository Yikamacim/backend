import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaViewModel } from "../../../common/models/MediaViewModel";
import { MediaQueries } from "../../../common/queries/MediaQueries";
import { MediaViewQueries } from "../../../common/queries/MediaViewQueries";
import { PurgeConstants } from "../app/constants/PurgeConstants";

export class PurgeProvider implements IProvider {
  public async getMedias(): Promise<ProviderResponse<MediaViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(MediaViewQueries.GET_MEDIAS);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(MediaViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteUnusedExpiredMedia(): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(MediaQueries.DELETE_MEDIAS_$ISUS_$EXPR, [
        false,
        PurgeConstants.UNUSED_MEDIA_EXPIRATION_TIME,
      ]);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
