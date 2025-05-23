import type { MediaData } from "../../../../@types/medias";
import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../../common/helpers/MediaHelper";
import { ServiceMediaRules } from "../../../../common/rules/ServiceMediaRules";
import { MyBusinessServicesProvider } from "./MyBusinessServicesProvider";
import type { MyBusinessServicesParams } from "./schemas/MyBusinessServicesParams";
import type { MyBusinessServicesRequest } from "./schemas/MyBusinessServicesRequest";
import { MyBusinessServicesResponse } from "./schemas/MyBusinessServicesResponse";

export class MyBusinessServicesManager implements IManager {
  public constructor(private readonly provider = new MyBusinessServicesProvider()) {}

  public async getMyBusinessServices(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessServicesResponse[] | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const services = await this.provider.getActiveServices(business.businessId);
    const responses: MyBusinessServicesResponse[] = [];
    for (const service of services) {
      let mediaData: MediaData | null = null;
      if (service.mediaId !== null) {
        const media = await this.provider.getMedia(service.mediaId);
        if (media === null) {
          return ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
            null,
          );
        }
        mediaData = await MediaHelper.mediaToMediaData(media);
      }
      responses.push(MyBusinessServicesResponse.fromModel(service, mediaData));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyBusinessServices(
    payload: TokenPayload,
    request: MyBusinessServicesRequest,
  ): Promise<ManagerResponse<MyBusinessServicesResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    if (business.isOpen === true) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    let mediaData: MediaData | null = null;
    if (request.mediaId !== null) {
      const findMediaResult = await MediaHelper.findMyMedia(payload.accountId, request.mediaId);
      if (findMediaResult.isLeft()) {
        return findMediaResult.get();
      }
      const media = findMediaResult.get();
      const checkMediaResult = await MediaHelper.checkMedia(media, ServiceMediaRules.ALLOWED_TYPES);
      if (checkMediaResult.isLeft()) {
        return checkMediaResult.get();
      }
      mediaData = await MediaHelper.mediaToMediaData(media);
    }
    const service = await this.provider.createService(
      business.businessId,
      request.title,
      request.mediaId,
      request.serviceCategory,
      request.description,
      request.unitPrice,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessServicesResponse.fromModel(service, mediaData),
    );
  }

  public async getMyBusinessServices$(
    payload: TokenPayload,
    params: MyBusinessServicesParams,
  ): Promise<ManagerResponse<MyBusinessServicesResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const service = await this.provider.getService(business.businessId, parseInt(params.serviceId));
    if (service === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SERVICE_NOT_FOUND)],
        null,
      );
    }
    let mediaData: MediaData | null = null;
    if (service.mediaId !== null) {
      const media = await this.provider.getMedia(service.mediaId);
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
          null,
        );
      }
      mediaData = await MediaHelper.mediaToMediaData(media);
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessServicesResponse.fromModel(service, mediaData),
    );
  }

  public async putMyBusinessServices$(
    payload: TokenPayload,
    params: MyBusinessServicesParams,
    request: MyBusinessServicesRequest,
  ): Promise<ManagerResponse<MyBusinessServicesResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    if (business.isOpen === true) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    const service = await this.provider.getService(business.businessId, parseInt(params.serviceId));
    if (service === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SERVICE_NOT_FOUND)],
        null,
      );
    }
    let mediaData: MediaData | null = null;
    if (request.mediaId !== null) {
      if (request.mediaId !== service.mediaId) {
        const mediaResult = await MediaHelper.findMyMedia(payload.accountId, request.mediaId);
        if (mediaResult.isLeft()) {
          return mediaResult.get();
        }
        const media = mediaResult.get();
        const checkMediaResult = await MediaHelper.checkMedia(
          media,
          ServiceMediaRules.ALLOWED_TYPES,
        );
        if (checkMediaResult.isLeft()) {
          return checkMediaResult.get();
        }
        mediaData = await MediaHelper.mediaToMediaData(media);
      } else {
        const media = await this.provider.getMedia(service.mediaId);
        if (media === null) {
          return ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
            null,
          );
        }
        mediaData = await MediaHelper.mediaToMediaData(media);
      }
    }
    const updatedService = await this.provider.updateService(
      service.serviceId,
      request.title,
      request.mediaId,
      request.serviceCategory,
      request.description,
      request.unitPrice,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessServicesResponse.fromModel(updatedService, mediaData),
    );
  }

  public async deleteMyBusinessServices$(
    payload: TokenPayload,
    params: MyBusinessServicesParams,
  ): Promise<ManagerResponse<null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    if (business.isOpen === true) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    const service = await this.provider.getService(business.businessId, parseInt(params.serviceId));
    if (service === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SERVICE_NOT_FOUND)],
        null,
      );
    }
    await this.provider.archiveService(service.serviceId);
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
