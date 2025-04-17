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
import { MyBlanketsProvider } from "./MyBlanketsProvider";
import type { MyBlanketsParams } from "./schemas/MyBlanketsParams";
import type { MyBlanketsRequest } from "./schemas/MyBlanketsRequest";
import { MyBlanketsResponse } from "./schemas/MyBlanketsResponse";

export class MyBlanketsManager implements IManager {
  public constructor(private readonly provider = new MyBlanketsProvider()) {}

  public async getMyBlankets(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBlanketsResponse[]>> {
    const myBlankets = await this.provider.getMyBlankets(payload.accountId);
    const responses: MyBlanketsResponse[] = [];
    for (const myBlanket of myBlankets) {
      const myBlanketMedias = await this.provider.getItemMedias(myBlanket.itemId);
      const myBlanketMediasData: MediaData[] = [];
      for (const myBlanketMedia of myBlanketMedias) {
        myBlanketMediasData.push({
          mediaId: myBlanketMedia.mediaId,
          mediaType: myBlanketMedia.mediaType,
          extension: myBlanketMedia.extension,
          url: await BucketModule.instance.getAccessUrl(
            FileUtil.getName(myBlanketMedia.mediaId.toString(), myBlanketMedia.extension),
          ),
        });
      }
      responses.push(MyBlanketsResponse.fromModel(myBlanket, myBlanketMediasData));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyBlankets(
    payload: TokenPayload,
    request: MyBlanketsRequest,
  ): Promise<ManagerResponse<MyBlanketsResponse | null>> {
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
    const myBlanket = await this.provider.createBlanket(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.blanketSize,
      request.blanketMaterial,
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
      MyBlanketsResponse.fromModel(myBlanket, mediaData),
    );
  }

  public async getMyBlankets$(
    payload: TokenPayload,
    params: MyBlanketsParams,
  ): Promise<ManagerResponse<MyBlanketsResponse | null>> {
    const myBlanket = await this.provider.getMyBlanket(
      payload.accountId,
      parseInt(params.blanketId),
    );
    if (myBlanket === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BLANKET_NOT_FOUND)],
        null,
      );
    }
    const myBlanketMedias = await this.provider.getItemMedias(myBlanket.itemId);
    const mediaData: MediaData[] = [];
    for (const itemMedia of myBlanketMedias) {
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
      MyBlanketsResponse.fromModel(myBlanket, mediaData),
    );
  }

  public async putMyBlankets$(
    payload: TokenPayload,
    params: MyBlanketsParams,
    request: MyBlanketsRequest,
  ): Promise<ManagerResponse<MyBlanketsResponse | null>> {
    const myBlanket = await this.provider.getMyBlanket(
      payload.accountId,
      parseInt(params.blanketId),
    );
    if (myBlanket === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BLANKET_NOT_FOUND)],
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
    const myBlanketMedias = await this.provider.getItemMedias(myBlanket.itemId);
    const myUpdatedBlanket = await this.provider.updateBlanket(
      payload.accountId,
      myBlanketMedias.map((itemMedia) => itemMedia.mediaId),
      myBlanket.blanketId,
      myBlanket.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.blanketSize,
      request.blanketMaterial,
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
      MyBlanketsResponse.fromModel(myUpdatedBlanket, mediaData),
    );
  }

  public async deleteMyBlankets$(
    payload: TokenPayload,
    params: MyBlanketsParams,
  ): Promise<ManagerResponse<null>> {
    const myBlanket = await this.provider.getMyBlanket(
      payload.accountId,
      parseInt(params.blanketId),
    );
    if (myBlanket === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BLANKET_NOT_FOUND)],
        null,
      );
    }
    const myBlanketMedias = await this.provider.getItemMedias(myBlanket.itemId);
    await this.provider.deleteBlanket(
      myBlanket.itemId,
      myBlanket.blanketId,
      myBlanketMedias.map((myBlanketMedia) => myBlanketMedia.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
