import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BusinessEntity } from "../../../common/entities/BusinessEntity";
import type { MediaEntity } from "../../../common/entities/MediaEntity";
import { HoursHelper } from "../../../common/helpers/HoursHelper";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { BusinessesProvider } from "./BusinessesProvider";
import type { BusinessesParams } from "./schemas/BusinessesParams";
import { BusinessesResponse } from "./schemas/BusinessesResponse";

export class BusinessesManager implements IManager {
  public constructor(private readonly provider = new BusinessesProvider()) {}

  public async getBusinesses$(
    params: BusinessesParams,
  ): Promise<ManagerResponse<BusinessesResponse | null>> {
    const business = await this.provider.getBusiness(parseInt(params.businessId));
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
          [new ClientError(ClientErrorCode.HAS_NO_MEDIA_WITH_ID)],
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
      BusinessesResponse.fromEntity(
        new BusinessEntity(business, mediaEntity, serviceCategories, hoursToday),
      ),
    );
  }
}
