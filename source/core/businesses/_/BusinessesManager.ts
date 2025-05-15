import type { TodayHours } from "../../../@types/hours";
import type { MediaData } from "../../../@types/medias";
import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { UnexpectedWeekdayError } from "../../../app/schemas/ServerError";
import { DateUtil } from "../../../app/utils/DateUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import type { HoursModel } from "../../../common/models/HoursModel";
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
    let mediaData: MediaData | null = null;
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
      mediaData = await MediaHelper.mediaToMediaData(media);
    }
    const serviceCategories = (await this.provider.getServices(business.businessId)).map(
      (service) => service.serviceCategory,
    );
    let todayHours: TodayHours | null = null;
    const hours = await this.provider.getHours(business.businessId);
    if (hours !== null) {
      todayHours = BusinessesManager.getTodayHours(hours);
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      BusinessesResponse.fromModel(business, mediaData, serviceCategories, todayHours),
    );
  }

  private static getTodayHours(hours: HoursModel): TodayHours {
    const weekday = DateUtil.getWeekday(new Date());
    switch (weekday) {
      case "Monday":
        return {
          todayFrom: hours.mondayFrom,
          todayTo: hours.mondayTo,
        };
      case "Tuesday":
        return {
          todayFrom: hours.tuesdayFrom,
          todayTo: hours.tuesdayTo,
        };
      case "Wednesday":
        return {
          todayFrom: hours.wednesdayFrom,
          todayTo: hours.wednesdayTo,
        };
      case "Thursday":
        return {
          todayFrom: hours.thursdayFrom,
          todayTo: hours.thursdayTo,
        };
      case "Friday":
        return {
          todayFrom: hours.fridayFrom,
          todayTo: hours.fridayTo,
        };
      case "Saturday":
        return {
          todayFrom: hours.saturdayFrom,
          todayTo: hours.saturdayTo,
        };
      case "Sunday":
        return {
          todayFrom: hours.sundayFrom,
          todayTo: hours.sundayTo,
        };
      default:
        throw new UnexpectedWeekdayError(weekday);
    }
  }
}
