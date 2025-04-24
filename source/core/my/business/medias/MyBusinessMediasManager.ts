import type { MediaData } from "../../../../@types/medias";
import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../../common/helpers/MediaHelper";
import { BusinessMediaRules } from "../../../../common/rules/BusinessMediaRules";
import { MyBusinessMediasProvider } from "./MyBusinessMediasProvider";
import type { MyBusinessMediasParams } from "./schemas/MyBusinessMediasParams";
import type { MyBusinessMediasRequest } from "./schemas/MyBusinessMediasRequest";
import { MyBusinessMediasResponse } from "./schemas/MyBusinessMediasResponse";

export class MyBusinessMediasManager implements IManager {
  public constructor(private readonly provider = new MyBusinessMediasProvider()) {}

  public async getMyBusinessMedias(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessMediasResponse[] | null>> {
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const myBusinessMedias = await this.provider.getMyBusinessMedias(myBusiness.businessId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(myBusinessMedias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessMediasResponse.fromModels(mediaDatas),
    );
  }

  public async postMyBusinessMedias(
    payload: TokenPayload,
    request: MyBusinessMediasRequest,
  ): Promise<ManagerResponse<MyBusinessMediasResponse | null>> {
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    let mediaData: MediaData | null = null;
    const findMediaResult = await MediaHelper.findMyMedia(payload.accountId, request.mediaId);
    if (findMediaResult.isLeft()) {
      return findMediaResult.get();
    }
    const media = findMediaResult.get();
    const checkMediaResult = await MediaHelper.checkMedia(media, BusinessMediaRules.ALLOWED_TYPES);
    if (checkMediaResult.isLeft()) {
      return checkMediaResult.get();
    }
    mediaData = await MediaHelper.mediaToMediaData(media);
    await this.provider.createBusinessMedia(myBusiness.businessId, request.mediaId);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessMediasResponse.fromModel(mediaData),
    );
  }

  public async getMyBusinessMedias$(
    payload: TokenPayload,
    params: MyBusinessMediasParams,
  ): Promise<ManagerResponse<MyBusinessMediasResponse | null>> {
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const media = await this.provider.getBusinessMedia(
      myBusiness.businessId,
      parseInt(params.mediaId),
    );
    if (media === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_MEDIA_NOT_FOUND)],
        null,
      );
    }
    const mediaData = await MediaHelper.mediaToMediaData(media);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessMediasResponse.fromModel(mediaData),
    );
  }

  public async deleteMyBusinessMedias$(
    payload: TokenPayload,
    params: MyBusinessMediasParams,
  ): Promise<ManagerResponse<null>> {
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    await this.provider.deleteBusinessMedia(myBusiness.businessId, parseInt(params.mediaId));
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
