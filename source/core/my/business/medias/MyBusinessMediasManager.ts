import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import type { MediaEntity } from "../../../../common/entities/MediaEntity";
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
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.HAS_NO_BUSINESS)],
        null,
      );
    }
    const medias = await this.provider.getBusinessMedias(business.businessId);
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessMediasResponse.fromEntities(mediaEntities),
    );
  }

  public async postMyBusinessMedias(
    payload: TokenPayload,
    request: MyBusinessMediasRequest,
  ): Promise<ManagerResponse<MyBusinessMediasResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.HAS_NO_BUSINESS)],
        null,
      );
    }
    let mediaEntity: MediaEntity | null = null;
    const findMediaResult = await MediaHelper.findMyMedia(payload.accountId, request.mediaId);
    if (findMediaResult.isLeft()) {
      return findMediaResult.get();
    }
    const media = findMediaResult.get();
    const checkMediaResult = await MediaHelper.checkMedia(media, BusinessMediaRules.ALLOWED_TYPES);
    if (checkMediaResult.isLeft()) {
      return checkMediaResult.get();
    }
    mediaEntity = await MediaHelper.mediaToEntity(media);
    await this.provider.createBusinessMedia(business.businessId, request.mediaId);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessMediasResponse.fromEntity(mediaEntity),
    );
  }

  public async getMyBusinessMedias$(
    payload: TokenPayload,
    params: MyBusinessMediasParams,
  ): Promise<ManagerResponse<MyBusinessMediasResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.HAS_NO_BUSINESS)],
        null,
      );
    }
    const media = await this.provider.getBusinessMedia(
      business.businessId,
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
    const mediaEntity = await MediaHelper.mediaToEntity(media);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessMediasResponse.fromEntity(mediaEntity),
    );
  }

  public async deleteMyBusinessMedias$(
    payload: TokenPayload,
    params: MyBusinessMediasParams,
  ): Promise<ManagerResponse<null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.HAS_NO_BUSINESS)],
        null,
      );
    }
    await this.provider.deleteBusinessMedia(business.businessId, parseInt(params.mediaId));
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
