import type { TodayHours } from "../../../../@types/hours";
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
import { MyBusinessOpenProvider } from "./MyBusinessOpenProvider";
import { MyBusinessOpenResponse } from "./schemas/MyBusinessOpenResponse";

export class MyBusinessOpenManager implements IManager {
  public constructor(private readonly provider = new MyBusinessOpenProvider()) {}

  public async putMyBusinessOpen(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessOpenResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.HAS_NO_BUSINESS)],
        null,
      );
    }
    if (business.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_ALREADY_OPEN)],
        null,
      );
    }
    const approval = await this.provider.getApproval(business.businessId);
    if (approval === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HAS_NO_APPROVAL)],
        null,
      );
    }
    if (approval.approvalState !== EApprovalState.APPROVED) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_APPROVED)],
        null,
      );
    }
    const bankAccount = await this.provider.getBankAccount(business.businessId);
    if (bankAccount === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HAS_NO_BANK_ACCOUNT)],
        null,
      );
    }
    const businessAreas = await this.provider.getBusinessAreas(business.businessId);
    if (businessAreas.length === 0) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HAS_NO_AREA)],
        null,
      );
    }
    const hours = await this.provider.getHours(business.businessId);
    if (hours === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HAS_NO_HOURS)],
        null,
      );
    }
    const services = await this.provider.getActiveServices(business.businessId);
    if (services.length === 0) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HAS_NO_SERVICES)],
        null,
      );
    }
    const openedBusiness = await this.provider.openBusiness(business.businessId);
    let mediaEntity: MediaEntity | null = null;
    if (openedBusiness.mediaId !== null) {
      const media = await this.provider.getBusinessMedia(
        openedBusiness.businessId,
        openedBusiness.mediaId,
      );
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.HAS_NO_MEDIA_WITH_ID)],
          null,
        );
      }
      mediaEntity = await MediaHelper.mediaToEntity(media);
    }
    const allServiceCategories = services.map((service) => service.serviceCategory);
    const serviceCategories = [...new Set(allServiceCategories)];
    let todayHours: TodayHours | null = null;
    if (hours !== null) {
      todayHours = HoursHelper.getTodayHours(hours);
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessOpenResponse.fromEntity(
        new BusinessEntity(business, mediaEntity, serviceCategories, todayHours),
      ),
    );
  }
}
