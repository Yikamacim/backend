import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { MediaType } from "../../../app/enums/MediaType";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedQueryResultError } from "../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaModel } from "../../../common/models/MediaModel";
import { MediaQueries } from "../../../common/queries/MediaQueries";

export class MyMediasProvider implements IProvider {
  public async createMyMedia(
    accountId: number,
    mediaType: MediaType,
  ): Promise<ProviderResponse<MediaModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(MediaQueries.INSERT_MEDIA_RT_$ACID_$MTYP, [
        accountId,
        mediaType,
      ]);
      const record: unknown = results.rows[0];
      if (!record) {
        throw new UnexpectedQueryResultError();
      }
      return await ResponseUtil.providerResponse(MediaModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
