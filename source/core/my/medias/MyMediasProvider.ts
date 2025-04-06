import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { MediaType } from "../../../common/enums/MediaType";
import { MediaModel } from "../../../common/models/MediaModel";
import { MediaQueries } from "../../../common/queries/MediaQueries";

export class MyMediasProvider implements IProvider {
  public async createMyMedia(
    accountId: number,
    mediaType: MediaType,
    extension: string,
  ): Promise<ProviderResponse<MediaModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(MediaQueries.INSERT_MEDIA_RT_$ACID_$MTYP_$EXTN, [
        accountId,
        mediaType,
        extension,
      ]);
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(MediaModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
