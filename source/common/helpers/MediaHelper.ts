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
import type { MediaBase } from "../bases/MediaBase";
import type { MediaType } from "../enums/MediaType";
import type { MediaViewModel } from "../models/MediaViewModel";
import { MediaProvider } from "../providers/MediaProvider";

export class MediaHelper implements IHelper {
  public static async mediasToMediaDatas(medias: MediaBase[]): Promise<MediaData[]> {
    const mediaDatas: MediaData[] = [];
    for (const media of medias) {
      mediaDatas.push(await MediaHelper.mediaToMediaData(media));
    }
    return mediaDatas;
  }

  public static async mediaToMediaData(media: MediaBase): Promise<MediaData> {
    return {
      mediaId: media.mediaId,
      mediaType: media.mediaType,
      extension: media.extension,
      url: await BucketModule.instance.getAccessUrl(
        FileUtil.getName(media.mediaId.toString(), media.extension),
      ),
    };
  }

  public static async findMedias(
    accountId: number,
    mediaIds: number[],
  ): Promise<Either<ManagerResponse<null>, MediaViewModel[]>> {
    const myMedias = await new MediaProvider().getMyUnusedMedias(accountId);
    const foundMedias: MediaViewModel[] = [];
    for (const mediaId of mediaIds) {
      const findMediaResult = await MediaHelper.findMedia(accountId, mediaId, myMedias);
      if (findMediaResult.isLeft()) {
        return Left.of(findMediaResult.get());
      }
      const myMedia = findMediaResult.get();
      foundMedias.push(myMedia);
    }
    return Right.of(foundMedias);
  }

  public static async findMedia(
    accountId: number,
    mediaId: number,
    myMedias: MediaViewModel[] | null = null,
  ): Promise<Either<ManagerResponse<null>, MediaViewModel>> {
    if (myMedias === null) {
      myMedias = await new MediaProvider().getMyUnusedMedias(accountId);
    }
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
    return Right.of(myMedia);
  }

  public static async checkMedias(
    medias: MediaViewModel[],
    allowedMediaTypes: MediaType[],
  ): Promise<Either<ManagerResponse<null>, null>> {
    for (const media of medias) {
      const checkMediaResult = await MediaHelper.checkMedia(media, allowedMediaTypes);
      if (checkMediaResult.isLeft()) {
        return Left.of(checkMediaResult.get());
      }
    }
    return Right.of(null);
  }

  public static async checkMedia(
    media: MediaViewModel,
    allowedMediaTypes: MediaType[],
  ): Promise<Either<ManagerResponse<null>, null>> {
    if (!allowedMediaTypes.includes(media.mediaType)) {
      return Left.of(
        ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.MEDIA_TYPE_NOT_ALLOWED)],
          null,
        ),
      );
    }
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
    return Right.of(null);
  }
}
