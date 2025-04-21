import type { MediaData } from "../../../@types/medias";
import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { BusinessMediaRules } from "../../../common/rules/BusinessMediaRules";
import { MyBusinessProvider } from "./MyBusinessProvider";
import type { MyBusinessRequest } from "./schemas/MyBusinessRequest";
import { MyBusinessResponse } from "./schemas/MyBusinessResponse";

export class MyBusinessManager implements IManager {
  public constructor(private readonly provider = new MyBusinessProvider()) {}

  public async getMyBusiness(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessResponse | null>> {
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    if (myBusiness.mediaId === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.OK),
        null,
        [],
        MyBusinessResponse.fromModel(myBusiness, null),
      );
    }
    const findMediaResult = await MediaHelper.findMedia(payload.accountId, myBusiness.mediaId);
    if (findMediaResult.isLeft()) {
      return findMediaResult.get();
    }
    const media = findMediaResult.get();
    const checkMediaResult = await MediaHelper.checkMedia(media, BusinessMediaRules.ALLOWED_TYPES);
    if (checkMediaResult.isLeft()) {
      return checkMediaResult.get();
    }
    const mediaData = await MediaHelper.mediaToMediaData(media);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessResponse.fromModel(myBusiness, mediaData),
    );
  }

  public async postMyBusiness(
    payload: TokenPayload,
    request: MyBusinessRequest,
  ): Promise<ManagerResponse<MyBusinessResponse | null>> {
    let mediaData: MediaData | null = null;
    if (request.mediaId !== null) {
      const findMediaResult = await MediaHelper.findMedia(payload.accountId, request.mediaId);
      if (findMediaResult.isLeft()) {
        return findMediaResult.get();
      }
      const media = findMediaResult.get();
      const checkMediaResult = await MediaHelper.checkMedia(
        media,
        BusinessMediaRules.ALLOWED_TYPES,
      );
      if (checkMediaResult.isLeft()) {
        return checkMediaResult.get();
      }
      mediaData = await MediaHelper.mediaToMediaData(media);
    }
    const myBusiness = await this.provider.createBusiness(
      payload.accountId,
      request.name,
      request.mediaId,
      request.address,
      request.phone,
      request.email,
      request.description,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessResponse.fromModel(myBusiness, mediaData),
    );
  }

  // public async putMyBusiness(
  //   payload: TokenPayload,
  //   request: MyBusinessRequest,
  // ): Promise<ManagerResponse<MyBusinessResponse | null>> {
  //   const myCarpet = await this.provider.getMyCarpet(payload.accountId, parseInt(params.carpetId));
  //   if (myCarpet === null) {
  //     return ResponseUtil.managerResponse(
  //       new HttpStatus(HttpStatusCode.NOT_FOUND),
  //       null,
  //       [new ClientError(ClientErrorCode.CARPET_NOT_FOUND)],
  //       null,
  //     );
  //   }
  //   const findMediasResult = await MediaHelper.findMedias(payload.accountId, request.mediaIds);
  //   if (findMediasResult.isLeft()) {
  //     return findMediasResult.get();
  //   }
  //   const medias = findMediasResult.get();
  //   const checkMediasResult = await MediaHelper.checkMedias(medias);
  //   if (checkMediasResult.isLeft()) {
  //     return checkMediasResult.get();
  //   }
  //   const oldMedias = await this.provider.getItemMedias(myCarpet.itemId);
  //   const myUpdatedCarpet = await this.provider.updateCarpet(
  //     payload.accountId,
  //     oldMedias.map((oldMedia) => oldMedia.mediaId),
  //     myCarpet.carpetId,
  //     myCarpet.itemId,
  //     request.name,
  //     request.description,
  //     request.mediaIds,
  //     request.width,
  //     request.length,
  //     request.carpetMaterial,
  //   );
  //   const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
  //   return ResponseUtil.managerResponse(
  //     new HttpStatus(HttpStatusCode.OK),
  //     null,
  //     [],
  //     MyBusinessResponse.fromModel(myUpdatedCarpet, mediaDatas),
  //   );
  // }
}
