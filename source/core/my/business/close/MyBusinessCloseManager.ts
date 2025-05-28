import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { BusinessEntity } from "../../../../common/entities/BusinessEntity";
import type { MediaEntity } from "../../../../common/entities/MediaEntity";
import { HoursHelper } from "../../../../common/helpers/HoursHelper";
import { MediaHelper } from "../../../../common/helpers/MediaHelper";
import { MyBusinessCloseProvider } from "./MyBusinessCloseProvider";
import { MyBusinessCloseResponse } from "./schemas/MyBusinessCloseResponse";

export class MyBusinessCloseManager implements IManager {
  public constructor(private readonly provider = new MyBusinessCloseProvider()) {}

  public async putMyBusinessClose(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessCloseResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    if (!business.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_ALREADY_CLOSED)],
        null,
      );
    }
    const closedBusiness = await this.provider.closeBusiness(business.businessId);
    let mediaEntity: MediaEntity | null = null;
    if (closedBusiness.mediaId !== null) {
      const media = await this.provider.getBusinessMedia(
        closedBusiness.businessId,
        closedBusiness.mediaId,
      );
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
    const allServiceCategories = (
      await this.provider.getActiveServices(closedBusiness.businessId)
    ).map((service) => service.serviceCategory);
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
      MyBusinessCloseResponse.fromEntity(
        new BusinessEntity(closedBusiness, mediaEntity, serviceCategories, hoursToday),
      ),
    );
  }
}
