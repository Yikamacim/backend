import type { MediaData } from "../../@types/medias";
import type { ManagerResponse } from "../../@types/responses";
import type { Either } from "../../app/concepts/Either";
import { Left } from "../../app/concepts/Left";
import { Right } from "../../app/concepts/Right";
import type { IHelper } from "../../app/interfaces/IHelper";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { FileUtil } from "../../app/utils/FileUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { BucketModule } from "../../modules/bucket/module";
import type { ItemMediaViewModel } from "../models/ItemMediaViewModel";
import type { MediaViewModel } from "../models/MediaViewModel";
import { MediaProvider } from "../providers/MediaProvider";
import { ItemMediaRules } from "../rules/ItemMediaRules";

export class MediaHelper implements IHelper {
  public static async mediasToMediaDatas(
    medias: MediaViewModel[] | ItemMediaViewModel[],
  ): Promise<MediaData[]> {
    const mediaDatas: MediaData[] = [];
    for (const media of medias) {
      mediaDatas.push({
        mediaId: media.mediaId,
        mediaType: media.mediaType,
        extension: media.extension,
        url: await BucketModule.instance.getAccessUrl(
          FileUtil.getName(media.mediaId.toString(), media.extension),
        ),
      });
    }
    return mediaDatas;
  }

  public static async findMedias(
    accountId: number,
    mediaIds: number[],
  ): Promise<Either<ManagerResponse<null>, MediaViewModel[]>> {
    const myMedias = await new MediaProvider().getMyMedias(accountId);
    const foundMedias: MediaViewModel[] = [];
    for (const mediaId of mediaIds) {
      const myMedia = myMedias.find((myMedia) => myMedia.mediaId === mediaId);
      if (myMedia === undefined) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
            null,
          ),
        );
      }
      foundMedias.push(myMedia);
    }
    return Right.of(foundMedias);
  }

  public static async checkMedias(
    medias: MediaViewModel[],
  ): Promise<Either<ManagerResponse<null>, null>> {
    for (const media of medias) {
      if (!ItemMediaRules.ALLOWED_TYPES.includes(media.mediaType)) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.BAD_REQUEST),
            null,
            [new ClientError(ClientErrorCode.MEDIA_TYPE_NOT_ALLOWED)],
            null,
          ),
        );
      }
    }
    for (const media of medias) {
      if (
        !(await BucketModule.instance.checkFileExists(
          FileUtil.getName(media.mediaId.toString(), media.extension),
        ))
      ) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.MEDIA_NOT_UPLOADED)],
            null,
          ),
        );
      }
    }
    return Right.of(null);
  }
}
