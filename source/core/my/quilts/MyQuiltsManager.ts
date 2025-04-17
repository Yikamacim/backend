import type { MediaData } from "../../../@types/medias";
import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { FileUtil } from "../../../app/utils/FileUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaModel } from "../../../common/models/MediaModel";
import { BucketModule } from "../../../modules/bucket/module";
import { MyQuiltsProvider } from "./MyQuiltsProvider";
import type { MyQuiltsParams } from "./schemas/MyQuiltsParams";
import type { MyQuiltsRequest } from "./schemas/MyQuiltsRequest";
import { MyQuiltsResponse } from "./schemas/MyQuiltsResponse";

export class MyQuiltsManager implements IManager {
  public constructor(private readonly provider = new MyQuiltsProvider()) {}

  public async getMyQuilts(payload: TokenPayload): Promise<ManagerResponse<MyQuiltsResponse[]>> {
    const myQuilts = await this.provider.getMyQuilts(payload.accountId);
    const responses: MyQuiltsResponse[] = [];
    for (const myQuilt of myQuilts) {
      const myQuiltMedias = await this.provider.getItemMedias(myQuilt.itemId);
      const myQuiltMediasData: MediaData[] = [];
      for (const myQuiltMedia of myQuiltMedias) {
        myQuiltMediasData.push({
          mediaId: myQuiltMedia.mediaId,
          mediaType: myQuiltMedia.mediaType,
          extension: myQuiltMedia.extension,
          url: await BucketModule.instance.getAccessUrl(
            FileUtil.getName(myQuiltMedia.mediaId.toString(), myQuiltMedia.extension),
          ),
        });
      }
      responses.push(MyQuiltsResponse.fromModel(myQuilt, myQuiltMediasData));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyQuilts(
    payload: TokenPayload,
    request: MyQuiltsRequest,
  ): Promise<ManagerResponse<MyQuiltsResponse | null>> {
    const myMedias = await this.provider.getMyMedias(payload.accountId);
    const medias: MediaModel[] = [];
    for (const mediaId of request.mediaIds) {
      const myMedia = myMedias.find((myMedia) => myMedia.mediaId === mediaId);
      if (myMedia === undefined) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
          null,
        );
      }
      medias.push(myMedia);
    }
    for (const media of medias) {
      if (
        !(await BucketModule.instance.checkFileExists(
          FileUtil.getName(media.mediaId.toString(), media.extension),
        ))
      ) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_UPLOADED)],
          null,
        );
      }
    }
    const myQuilt = await this.provider.createQuilt(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.quiltSize,
      request.quiltMaterial,
    );
    const mediaData: MediaData[] = [];
    for (const media of medias) {
      mediaData.push({
        mediaId: media.mediaId,
        mediaType: media.mediaType,
        extension: media.extension,
        url: await BucketModule.instance.getAccessUrl(
          FileUtil.getName(media.mediaId.toString(), media.extension),
        ),
      });
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyQuiltsResponse.fromModel(myQuilt, mediaData),
    );
  }

  public async getMyQuilts$(
    payload: TokenPayload,
    params: MyQuiltsParams,
  ): Promise<ManagerResponse<MyQuiltsResponse | null>> {
    const myQuilt = await this.provider.getMyQuilt(payload.accountId, parseInt(params.quiltId));
    if (myQuilt === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.QUILT_NOT_FOUND)],
        null,
      );
    }
    const myQuiltMedias = await this.provider.getItemMedias(myQuilt.itemId);
    const mediaData: MediaData[] = [];
    for (const itemMedia of myQuiltMedias) {
      mediaData.push({
        mediaId: itemMedia.mediaId,
        mediaType: itemMedia.mediaType,
        extension: itemMedia.extension,
        url: await BucketModule.instance.getAccessUrl(
          FileUtil.getName(itemMedia.mediaId.toString(), itemMedia.extension),
        ),
      });
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyQuiltsResponse.fromModel(myQuilt, mediaData),
    );
  }

  public async putMyQuilts$(
    payload: TokenPayload,
    params: MyQuiltsParams,
    request: MyQuiltsRequest,
  ): Promise<ManagerResponse<MyQuiltsResponse | null>> {
    const myQuilt = await this.provider.getMyQuilt(payload.accountId, parseInt(params.quiltId));
    if (myQuilt === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.QUILT_NOT_FOUND)],
        null,
      );
    }
    const myMedias = await this.provider.getMyMedias(payload.accountId);
    const medias: MediaModel[] = [];
    for (const mediaId of request.mediaIds) {
      const myMedia = myMedias.find((myMedia) => myMedia.mediaId === mediaId);
      if (myMedia === undefined) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
          null,
        );
      }
      medias.push(myMedia);
    }
    for (const media of medias) {
      if (
        !(await BucketModule.instance.checkFileExists(
          FileUtil.getName(media.mediaId.toString(), media.extension),
        ))
      ) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_UPLOADED)],
          null,
        );
      }
    }
    const myQuiltMedias = await this.provider.getItemMedias(myQuilt.itemId);
    const myUpdatedQuilt = await this.provider.updateQuilt(
      payload.accountId,
      myQuiltMedias.map((itemMedia) => itemMedia.mediaId),
      myQuilt.quiltId,
      myQuilt.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.quiltSize,
      request.quiltMaterial,
    );
    const mediaData: MediaData[] = [];
    for (const media of medias) {
      mediaData.push({
        mediaId: media.mediaId,
        mediaType: media.mediaType,
        extension: media.extension,
        url: await BucketModule.instance.getAccessUrl(
          FileUtil.getName(media.mediaId.toString(), media.extension),
        ),
      });
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyQuiltsResponse.fromModel(myUpdatedQuilt, mediaData),
    );
  }

  public async deleteMyQuilts$(
    payload: TokenPayload,
    params: MyQuiltsParams,
  ): Promise<ManagerResponse<null>> {
    const myQuilt = await this.provider.getMyQuilt(payload.accountId, parseInt(params.quiltId));
    if (myQuilt === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.QUILT_NOT_FOUND)],
        null,
      );
    }
    const myQuiltMedias = await this.provider.getItemMedias(myQuilt.itemId);
    await this.provider.deleteQuilt(
      myQuilt.itemId,
      myQuilt.quiltId,
      myQuiltMedias.map((myQuiltMedia) => myQuiltMedia.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
