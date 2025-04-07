import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaModel } from "../../../common/models/MediaModel";
import { MediaQueries } from "../../../common/queries/MediaQueries";
import { PurgeConstants } from "../app/constants/PurgeConstants";

export class PurgeProvider implements IProvider {
  public async getMedias(): Promise<ProviderResponse<MediaModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(MediaQueries.GET_MEDIAS);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(MediaModel.fromRecords(records));
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
