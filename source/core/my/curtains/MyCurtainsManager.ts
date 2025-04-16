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
import { MyCurtainsProvider } from "./MyCurtainsProvider";
import type { MyCurtainsParams } from "./schemas/MyCurtainsParams";
import type { MyCurtainsRequest } from "./schemas/MyCurtainsRequest";
import { MyCurtainsResponse } from "./schemas/MyCurtainsResponse";

export class MyCurtainsManager implements IManager {
  public constructor(private readonly provider = new MyCurtainsProvider()) {}

  public async getMyCurtains(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyCurtainsResponse[]>> {
    const myCurtains = await this.provider.getMyCurtains(payload.accountId);
    const responses: MyCurtainsResponse[] = [];
    for (const myCurtain of myCurtains) {
      const myCurtainMedias = await this.provider.getItemMedias(myCurtain.itemId);
      const myCurtainMediasData: MediaData[] = [];
      for (const myCurtainMedia of myCurtainMedias) {
        myCurtainMediasData.push({
          mediaId: myCurtainMedia.mediaId,
          mediaType: myCurtainMedia.mediaType,
          extension: myCurtainMedia.extension,
          url: await BucketModule.instance.getAccessUrl(
            FileUtil.getName(myCurtainMedia.mediaId.toString(), myCurtainMedia.extension),
          ),
        });
      }
      responses.push(MyCurtainsResponse.fromModel(myCurtain, myCurtainMediasData));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyCurtains(
    payload: TokenPayload,
    request: MyCurtainsRequest,
  ): Promise<ManagerResponse<MyCurtainsResponse | null>> {
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
    const myCurtain = await this.provider.createCurtain(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.width,
      request.length,
      request.curtainType,
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
      MyCurtainsResponse.fromModel(myCurtain, mediaData),
    );
  }

  public async getMyCurtains$(
    payload: TokenPayload,
    params: MyCurtainsParams,
  ): Promise<ManagerResponse<MyCurtainsResponse | null>> {
    const myCurtain = await this.provider.getMyCurtain(
      payload.accountId,
      parseInt(params.curtainId),
    );
    if (myCurtain === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CURTAIN_NOT_FOUND)],
        null,
      );
    }
    const myCurtainMedias = await this.provider.getItemMedias(myCurtain.itemId);
    const mediaData: MediaData[] = [];
    for (const itemMedia of myCurtainMedias) {
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
      MyCurtainsResponse.fromModel(myCurtain, mediaData),
    );
  }

  public async putMyCurtains$(
    payload: TokenPayload,
    params: MyCurtainsParams,
    request: MyCurtainsRequest,
  ): Promise<ManagerResponse<MyCurtainsResponse | null>> {
    const myCurtain = await this.provider.getMyCurtain(
      payload.accountId,
      parseInt(params.curtainId),
    );
    if (myCurtain === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CURTAIN_NOT_FOUND)],
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
    const myCurtainMedias = await this.provider.getItemMedias(myCurtain.itemId);
    const myUpdatedCurtain = await this.provider.updateCurtain(
      payload.accountId,
      myCurtainMedias.map((itemMedia) => itemMedia.mediaId),
      myCurtain.curtainId,
      myCurtain.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.width,
      request.length,
      request.curtainType,
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
      MyCurtainsResponse.fromModel(myUpdatedCurtain, mediaData),
    );
  }

  public async deleteMyCurtains$(
    payload: TokenPayload,
    params: MyCurtainsParams,
  ): Promise<ManagerResponse<null>> {
    const myCurtain = await this.provider.getMyCurtain(
      payload.accountId,
      parseInt(params.curtainId),
    );
    if (myCurtain === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CURTAIN_NOT_FOUND)],
        null,
      );
    }
    const myCurtainMedias = await this.provider.getItemMedias(myCurtain.itemId);
    await this.provider.deleteCurtain(
      myCurtain.itemId,
      myCurtain.curtainId,
      myCurtainMedias.map((myCurtainMedia) => myCurtainMedia.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
