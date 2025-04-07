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
import { MyCarpetsProvider } from "./MyCarpetsProvider";
import type { MyCarpetsParams } from "./schemas/MyCarpetsParams";
import type { MyCarpetsRequest } from "./schemas/MyCarpetsRequest";
import { MyCarpetsResponse } from "./schemas/MyCarpetsResponse";

export class MyCarpetsManager implements IManager {
  public constructor(private readonly provider = new MyCarpetsProvider()) {}

  public async getMyCarpets(payload: TokenPayload): Promise<ManagerResponse<MyCarpetsResponse[]>> {
    const myCarpets = await this.provider.getMyCarpets(payload.accountId);
    const responses: MyCarpetsResponse[] = [];
    for (const myCarpet of myCarpets) {
      const myCarpetMedias = await this.provider.getItemMedias(myCarpet.itemId);
      const myCarpetMediasData: MediaData[] = [];
      for (const myCarpetMedia of myCarpetMedias) {
        myCarpetMediasData.push({
          mediaId: myCarpetMedia.mediaId,
          mediaType: myCarpetMedia.mediaType,
          extension: myCarpetMedia.extension,
          url: await BucketModule.instance.getAccessUrl(
            FileUtil.getName(myCarpetMedia.mediaId.toString(), myCarpetMedia.extension),
          ),
        });
      }
      responses.push(MyCarpetsResponse.fromModel(myCarpet, myCarpetMediasData));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyCarpets(
    payload: TokenPayload,
    request: MyCarpetsRequest,
  ): Promise<ManagerResponse<MyCarpetsResponse | null>> {
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
    const myCarpet = await this.provider.createCarpet(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.width,
      request.length,
      request.carpetMaterial,
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
      MyCarpetsResponse.fromModel(myCarpet, mediaData),
    );
  }

  public async getMyCarpets$(
    payload: TokenPayload,
    params: MyCarpetsParams,
  ): Promise<ManagerResponse<MyCarpetsResponse | null>> {
    const myCarpet = await this.provider.getMyCarpet(payload.accountId, parseInt(params.carpetId));
    if (myCarpet === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CARPET_NOT_FOUND)],
        null,
      );
    }
    const itemMedias = await this.provider.getItemMedias(myCarpet.itemId);
    const mediaData: MediaData[] = [];
    for (const itemMedia of itemMedias) {
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
      MyCarpetsResponse.fromModel(myCarpet, mediaData),
    );
  }

  public async putMyCarpets$(
    payload: TokenPayload,
    params: MyCarpetsParams,
    request: MyCarpetsRequest,
  ): Promise<ManagerResponse<MyCarpetsResponse | null>> {
    const myCarpet = await this.provider.getMyCarpet(payload.accountId, parseInt(params.carpetId));
    if (myCarpet === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CARPET_NOT_FOUND)],
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
    const itemMedias = await this.provider.getItemMedias(myCarpet.itemId);
    const myUpdatedCarpet = await this.provider.updateCarpet(
      payload.accountId,
      itemMedias.map((itemMedia) => itemMedia.mediaId),
      myCarpet.carpetId,
      myCarpet.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.width,
      request.length,
      request.carpetMaterial,
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
    // Return my carpet
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyCarpetsResponse.fromModel(myUpdatedCarpet, mediaData),
    );
  }

  public async deleteMyCarpets$(
    payload: TokenPayload,
    params: MyCarpetsParams,
  ): Promise<ManagerResponse<null>> {
    const myCarpet = await this.provider.getMyCarpet(payload.accountId, parseInt(params.carpetId));
    if (myCarpet === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CARPET_NOT_FOUND)],
        null,
      );
    }
    const myCarpetMedias = await this.provider.getItemMedias(myCarpet.itemId);
    await this.provider.deleteCarpet(
      myCarpet.itemId,
      myCarpet.carpetId,
      myCarpetMedias.map((myCarpetMedia) => myCarpetMedia.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.NO_CONTENT), null, [], null);
  }
}
