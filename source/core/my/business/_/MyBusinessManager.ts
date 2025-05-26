import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { BusinessEntity } from "../../../../common/entities/BusinessEntity";
import type { MediaEntity } from "../../../../common/entities/MediaEntity";
import { EApprovalState } from "../../../../common/enums/EApprovalState";
import { HoursHelper } from "../../../../common/helpers/HoursHelper";
import { MediaHelper } from "../../../../common/helpers/MediaHelper";
import { BusinessMediaRules } from "../../../../common/rules/BusinessMediaRules";
import { MyBusinessProvider } from "./MyBusinessProvider";
import type { MyBusinessRequest } from "./schemas/MyBusinessRequest";
import { MyBusinessResponse } from "./schemas/MyBusinessResponse";

export class MyBusinessManager implements IManager {
  public constructor(private readonly provider = new MyBusinessProvider()) {}

  public async getMyBusiness(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    let mediaEntity: MediaEntity | null = null;
    if (business.mediaId !== null) {
      const media = await this.provider.getBusinessMedia(business.businessId, business.mediaId);
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
          null,
        );
      }
      mediaEntity = await MediaHelper.mediaToEntity(media);
    }
    const allServiceCategories = (await this.provider.getActiveServices(business.businessId)).map(
      (service) => service.serviceCategory,
    );
    const serviceCategories = [...new Set(allServiceCategories)];
    let hoursToday: {
      readonly from: string | null;
      readonly to: string | null;
    } | null = null;
    const hours = await this.provider.getHours(business.businessId);
    if (hours !== null) {
      hoursToday = HoursHelper.getTodayHours(hours);
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessResponse.fromEntity(
        new BusinessEntity(business, mediaEntity, serviceCategories, hoursToday),
      ),
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
    let mediaEntity: MediaEntity | null = null;
    if (request.mediaId !== null) {
      const findMediaResult = await MediaHelper.findMyMedia(payload.accountId, request.mediaId);
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
      mediaEntity = await MediaHelper.mediaToEntity(media);
    }
    const business = await this.provider.createMyBusiness(
      payload.accountId,
      request.name,
      request.mediaId,
      request.address,
      request.phone,
      request.email,
      request.description,
    );
    const allServiceCategories = (await this.provider.getActiveServices(business.businessId)).map(
      (service) => service.serviceCategory,
    );
    const serviceCategories = [...new Set(allServiceCategories)];
    let hoursToday: {
      readonly from: string | null;
      readonly to: string | null;
    } | null = null;
    const hours = await this.provider.getHours(business.businessId);
    if (hours !== null) {
      hoursToday = HoursHelper.getTodayHours(hours);
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessResponse.fromEntity(
        new BusinessEntity(business, mediaEntity, serviceCategories, hoursToday),
      ),
    );
  }

  public async putMyBusiness(
    payload: TokenPayload,
    request: MyBusinessRequest,
  ): Promise<ManagerResponse<MyBusinessResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
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
      if (request.mediaId !== business.mediaId) {
        const mediaResult = await MediaHelper.findMyMedia(payload.accountId, request.mediaId);
        if (mediaResult.isLeft()) {
          return mediaResult.get();
        }
        const media = mediaResult.get();
        const checkMediaResult = await MediaHelper.checkMedia(
          media,
          BusinessMediaRules.ALLOWED_TYPES,
        );
        if (checkMediaResult.isLeft()) {
          return checkMediaResult.get();
        }
        mediaEntity = await MediaHelper.mediaToEntity(media);
      } else {
        const media = await this.provider.getBusinessMedia(business.businessId, business.mediaId);
        if (media === null) {
          return ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
            null,
          );
        }
        mediaEntity = await MediaHelper.mediaToEntity(media);
      }
    }
    const updatedBusiness = await this.provider.updateBusiness(
      business.businessId,
      request.name,
      request.mediaId,
      business.addressId,
      request.address,
      request.phone,
      request.email,
      request.description,
    );
    if (updatedBusiness.name !== business.name) {
      const myBusinessApproval = await this.provider.getApproval(business.businessId);
      if (myBusinessApproval !== null) {
        await this.provider.updateApproval(
          myBusinessApproval.businessId,
          EApprovalState.OBSOLETE,
          "İşletme bilgileri güncellendi.",
        );
      }
    }
    const allServiceCategories = (await this.provider.getActiveServices(business.businessId)).map(
      (service) => service.serviceCategory,
    );
    const serviceCategories = [...new Set(allServiceCategories)];
    let hoursToday: {
      readonly from: string | null;
      readonly to: string | null;
    } | null = null;
    const hours = await this.provider.getHours(business.businessId);
    if (hours !== null) {
      hoursToday = HoursHelper.getTodayHours(hours);
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessResponse.fromEntity(
        new BusinessEntity(updatedBusiness, mediaEntity, serviceCategories, hoursToday),
      ),
    );
  }
}
