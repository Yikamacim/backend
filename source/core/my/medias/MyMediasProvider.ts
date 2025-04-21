import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { MediaType } from "../../../common/enums/MediaType";
import { MediaModel } from "../../../common/models/MediaModel";
import { MediaViewModel } from "../../../common/models/MediaViewModel";
import { MediaQueries } from "../../../common/queries/MediaQueries";
import { MediaViewQueries } from "../../../common/queries/MediaViewQueries";

export class MyMediasProvider implements IProvider {
  public async createMyMedia(
    accountId: number,
    mediaType: MediaType,
    extension: string,
  ): Promise<ProviderResponse<MediaViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const media = await this.partialCreateMedia(accountId, mediaType, extension);
      const mediaView = await this.partialGetMyMedia(media.mediaId);
      if (mediaView === null) {
        throw new UnexpectedDatabaseStateError(
          `Media with ID ${media.mediaId} not found after creation.`,
        );
      }
      return await ResponseUtil.providerResponse(MediaViewModel.fromRecord(mediaView));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetMyMedia(
    mediaId: number,
  ): Promise<ProviderResponse<MediaViewModel | null>> {
    const results = await DbConstants.POOL.query(MediaViewQueries.GET_MEDIA_$MDID, [mediaId]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return ResponseUtil.providerResponse(null);
    }
    return await ResponseUtil.providerResponse(MediaViewModel.fromRecord(record));
  }

  private async partialCreateMedia(
    accountId: number,
    mediaType: MediaType,
    extension: string,
  ): Promise<MediaModel> {
    const results = await DbConstants.POOL.query(MediaQueries.INSERT_MEDIA_RT_$ACID_$MTYP_$EXTN, [
      accountId,
      mediaType,
      extension,
    ]);
    const record: unknown = results.rows[0];
    return MediaModel.fromRecord(record);
  }
}
