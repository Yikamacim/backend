import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import type { MediaEntity } from "../../../../common/entities/MediaEntity";
import { ServiceEntity } from "../../../../common/entities/ServiceEntity";
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
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    const services = await this.provider.getActiveServices(business.businessId);
    const entities: ServiceEntity[] = [];
    for (const service of services) {
      let mediaEntity: MediaEntity | null = null;
      if (service.mediaId !== null) {
        const media = await this.provider.getMedia(service.mediaId);
        if (media === null) {
          return ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_MEDIA_WITH_THIS_ID)],
            null,
          );
        }
        mediaEntity = await MediaHelper.mediaToEntity(media);
      }
      entities.push(new ServiceEntity(service, mediaEntity));
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessServicesResponse.fromEntities(entities),
    );
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
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    if (business.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    let mediaEntity: MediaEntity | null = null;
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
      mediaEntity = await MediaHelper.mediaToEntity(media);
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
      MyBusinessServicesResponse.fromEntity(new ServiceEntity(service, mediaEntity)),
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
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    const service = await this.provider.getActiveService(
      business.businessId,
      parseInt(params.serviceId),
    );
    if (service === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SERVICE_NOT_FOUND)],
        null,
      );
    }
    let mediaEntity: MediaEntity | null = null;
    if (service.mediaId !== null) {
      const media = await this.provider.getMedia(service.mediaId);
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_MEDIA_WITH_THIS_ID)],
          null,
        );
      }
      mediaEntity = await MediaHelper.mediaToEntity(media);
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessServicesResponse.fromEntity(new ServiceEntity(service, mediaEntity)),
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
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    if (business.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    const service = await this.provider.getActiveService(
      business.businessId,
      parseInt(params.serviceId),
    );
    if (service === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SERVICE_NOT_FOUND)],
        null,
      );
    }
    if (request.serviceCategory !== service.serviceCategory) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        [new ClientError(ClientErrorCode.SERVICE_CATEGORY_CANT_BE_CHANGED)],
        null,
      );
    }
    let mediaEntity: MediaEntity | null = null;
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
        mediaEntity = await MediaHelper.mediaToEntity(media);
      } else {
        const media = await this.provider.getMedia(service.mediaId);
        if (media === null) {
          return ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_MEDIA_WITH_THIS_ID)],
            null,
          );
        }
        mediaEntity = await MediaHelper.mediaToEntity(media);
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
      MyBusinessServicesResponse.fromEntity(new ServiceEntity(updatedService, mediaEntity)),
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
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    if (business.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    const service = await this.provider.getActiveService(
      business.businessId,
      parseInt(params.serviceId),
    );
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
