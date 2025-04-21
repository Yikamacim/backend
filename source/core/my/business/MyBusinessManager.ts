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
    const media = await this.provider.getMedia(myBusiness.mediaId);
    if (media === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
        null,
      );
    }
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
    if ((await this.provider.getMyBusiness(payload.accountId)) !== null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_ALREADY_EXISTS)],
        null,
      );
    }
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

  public async putMyBusiness(
    payload: TokenPayload,
    request: MyBusinessRequest,
  ): Promise<ManagerResponse<MyBusinessResponse | null>> {
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    if (myBusiness.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    let mediaData: MediaData | null = null;
    if (request.mediaId !== null) {
      const media = await this.provider.getMedia(request.mediaId);
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
          null,
        );
      }
      const checkMediaResult = await MediaHelper.checkMedia(
        media,
        BusinessMediaRules.ALLOWED_TYPES,
      );
      if (checkMediaResult.isLeft()) {
        return checkMediaResult.get();
      }
      mediaData = await MediaHelper.mediaToMediaData(media);
    }
    const myUpdatedBusiness = await this.provider.updateBusiness(
      payload.accountId,
      request.name,
      request.mediaId,
      myBusiness.addressId,
      request.address,
      request.phone,
      request.email,
      request.description,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessResponse.fromModel(myUpdatedBusiness, mediaData),
    );
  }
}
