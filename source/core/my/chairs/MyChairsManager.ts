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
import { MyChairsProvider } from "./MyChairsProvider";
import type { MyChairsParams } from "./schemas/MyChairsParams";
import type { MyChairsRequest } from "./schemas/MyChairsRequest";
import { MyChairsResponse } from "./schemas/MyChairsResponse";

export class MyChairsManager implements IManager {
  public constructor(private readonly provider = new MyChairsProvider()) {}

  public async getMyChairs(payload: TokenPayload): Promise<ManagerResponse<MyChairsResponse[]>> {
    const myChairs = await this.provider.getMyChairs(payload.accountId);
    const responses: MyChairsResponse[] = [];
    for (const myChair of myChairs) {
      const myChairMedias = await this.provider.getItemMedias(myChair.itemId);
      const myChairMediasData: MediaData[] = [];
      for (const myChairMedia of myChairMedias) {
        myChairMediasData.push({
          mediaId: myChairMedia.mediaId,
          mediaType: myChairMedia.mediaType,
          extension: myChairMedia.extension,
          url: await BucketModule.instance.getAccessUrl(
            FileUtil.getName(myChairMedia.mediaId.toString(), myChairMedia.extension),
          ),
        });
      }
      responses.push(MyChairsResponse.fromModel(myChair, myChairMediasData));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyChairs(
    payload: TokenPayload,
    request: MyChairsRequest,
  ): Promise<ManagerResponse<MyChairsResponse | null>> {
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
    const myChair = await this.provider.createChair(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.quantity,
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
      MyChairsResponse.fromModel(myChair, mediaData),
    );
  }

  public async getMyChairs$(
    payload: TokenPayload,
    params: MyChairsParams,
  ): Promise<ManagerResponse<MyChairsResponse | null>> {
    const myChair = await this.provider.getMyChair(payload.accountId, parseInt(params.chairId));
    if (myChair === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SOFA_NOT_FOUND)],
        null,
      );
    }
    const myChairMedias = await this.provider.getItemMedias(myChair.itemId);
    const mediaData: MediaData[] = [];
    for (const itemMedia of myChairMedias) {
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
      MyChairsResponse.fromModel(myChair, mediaData),
    );
  }

  public async putMyChairs$(
    payload: TokenPayload,
    params: MyChairsParams,
    request: MyChairsRequest,
  ): Promise<ManagerResponse<MyChairsResponse | null>> {
    const myChair = await this.provider.getMyChair(payload.accountId, parseInt(params.chairId));
    if (myChair === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SOFA_NOT_FOUND)],
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
    const myChairMedias = await this.provider.getItemMedias(myChair.itemId);
    const myUpdatedChair = await this.provider.updateChair(
      payload.accountId,
      myChairMedias.map((itemMedia) => itemMedia.mediaId),
      myChair.chairId,
      myChair.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.quantity,
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
      MyChairsResponse.fromModel(myUpdatedChair, mediaData),
    );
  }

  public async deleteMyChairs$(
    payload: TokenPayload,
    params: MyChairsParams,
  ): Promise<ManagerResponse<null>> {
    const myChair = await this.provider.getMyChair(payload.accountId, parseInt(params.chairId));
    if (myChair === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SOFA_NOT_FOUND)],
        null,
      );
    }
    const myChairMedias = await this.provider.getItemMedias(myChair.itemId);
    await this.provider.deleteChair(
      myChair.itemId,
      myChair.chairId,
      myChairMedias.map((myChairMedia) => myChairMedia.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
