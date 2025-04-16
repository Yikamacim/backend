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
import { MyBedsProvider } from "./MyBedsProvider";
import type { MyBedsParams } from "./schemas/MyBedsParams";
import type { MyBedsRequest } from "./schemas/MyBedsRequest";
import { MyBedsResponse } from "./schemas/MyCarpetsResponse";

export class MyBedsManager implements IManager {
  public constructor(private readonly provider = new MyBedsProvider()) {}

  public async getMyBeds(payload: TokenPayload): Promise<ManagerResponse<MyBedsResponse[]>> {
    const myBeds = await this.provider.getMyBeds(payload.accountId);
    const responses: MyBedsResponse[] = [];
    for (const myBed of myBeds) {
      const myBedMedias = await this.provider.getItemMedias(myBed.itemId);
      const myBedMediasData: MediaData[] = [];
      for (const myBedMedia of myBedMedias) {
        myBedMediasData.push({
          mediaId: myBedMedia.mediaId,
          mediaType: myBedMedia.mediaType,
          extension: myBedMedia.extension,
          url: await BucketModule.instance.getAccessUrl(
            FileUtil.getName(myBedMedia.mediaId.toString(), myBedMedia.extension),
          ),
        });
      }
      responses.push(MyBedsResponse.fromModel(myBed, myBedMediasData));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyBeds(
    payload: TokenPayload,
    request: MyBedsRequest,
  ): Promise<ManagerResponse<MyBedsResponse | null>> {
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
    const myBed = await this.provider.createBed(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.bedType,
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
      MyBedsResponse.fromModel(myBed, mediaData),
    );
  }

  public async getMyBeds$(
    payload: TokenPayload,
    params: MyBedsParams,
  ): Promise<ManagerResponse<MyBedsResponse | null>> {
    const myBed = await this.provider.getMyBed(payload.accountId, parseInt(params.bedId));
    if (myBed === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BED_NOT_FOUND)],
        null,
      );
    }
    const myBedMedias = await this.provider.getItemMedias(myBed.itemId);
    const mediaData: MediaData[] = [];
    for (const itemMedia of myBedMedias) {
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
      MyBedsResponse.fromModel(myBed, mediaData),
    );
  }

  public async putMyBeds$(
    payload: TokenPayload,
    params: MyBedsParams,
    request: MyBedsRequest,
  ): Promise<ManagerResponse<MyBedsResponse | null>> {
    const myBed = await this.provider.getMyBed(payload.accountId, parseInt(params.bedId));
    if (myBed === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BED_NOT_FOUND)],
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
    const myBedMedias = await this.provider.getItemMedias(myBed.itemId);
    const myUpdatedBed = await this.provider.updateBed(
      payload.accountId,
      myBedMedias.map((itemMedia) => itemMedia.mediaId),
      myBed.bedId,
      myBed.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.bedType,
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
      MyBedsResponse.fromModel(myUpdatedBed, mediaData),
    );
  }

  public async deleteMyBeds$(
    payload: TokenPayload,
    params: MyBedsParams,
  ): Promise<ManagerResponse<null>> {
    const myBed = await this.provider.getMyBed(payload.accountId, parseInt(params.bedId));
    if (myBed === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BED_NOT_FOUND)],
        null,
      );
    }
    const myBedMedias = await this.provider.getItemMedias(myBed.itemId);
    await this.provider.deleteBed(
      myBed.itemId,
      myBed.bedId,
      myBedMedias.map((myBedMedia) => myBedMedia.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
