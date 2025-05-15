import type { MediaData } from "../../../../@types/medias";
import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { ApprovalState } from "../../../../common/enums/ApprovalState";
import { MediaHelper } from "../../../../common/helpers/MediaHelper";
import { MyBusinessOpenProvider } from "./MyBusinessOpenProvider";
import { MyBusinessOpenResponse } from "./schemas/MyBusinessOpenResponse";

export class MyBusinessOpenManager implements IManager {
  public constructor(private readonly provider = new MyBusinessOpenProvider()) {}

  public async putMyBusinessOpen(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessOpenResponse | null>> {
    const business = await this.provider.getBusinessByAccountId(payload.accountId);
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
        [new ClientError(ClientErrorCode.BUSINESS_ALREADY_OPEN)],
        null,
      );
    }
    const approval = await this.provider.getApproval(business.businessId);
    if (approval === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_DOESNT_HAVE_APPROVAL)],
        null,
      );
    }
    if (approval.approvalState !== ApprovalState.APPROVED) {
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
        [new ClientError(ClientErrorCode.BUSINESS_DOESNT_HAVE_BANK_ACCOUNT)],
        null,
      );
    }
    const businessAreas = await this.provider.getBusinessAreas(business.businessId);
    if (businessAreas.length === 0) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_DOESNT_HAVE_AREA)],
        null,
      );
    }
    const hours = await this.provider.getHours(business.businessId);
    if (hours === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_DOESNT_HAVE_HOURS)],
        null,
      );
    }
    const services = await this.provider.getServices(business.businessId);
    if (services.length === 0) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_DOESNT_HAVE_SERVICES)],
        null,
      );
    }
    const updatedBusiness = await this.provider.openBusiness(
      payload.accountId,
      business.businessId,
    );
    let mediaData: MediaData | null = null;
    if (updatedBusiness.mediaId !== null) {
      const media = await this.provider.getBusinessMedia(
        updatedBusiness.businessId,
        updatedBusiness.mediaId,
      );
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.BUSINESS_MEDIA_NOT_FOUND)],
          null,
        );
      }
      mediaData = await MediaHelper.mediaToMediaData(media);
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessOpenResponse.fromModel(updatedBusiness, mediaData),
    );
  }
}
