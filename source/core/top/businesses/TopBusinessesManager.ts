import type { ManagerResponse } from "../../../@types/responses";
import { BusinessConstants } from "../../../app/constants/BusinessConstants";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BusinessEntity } from "../../../common/entities/BusinessEntity";
import type { MediaEntity } from "../../../common/entities/MediaEntity";
import { HoursHelper } from "../../../common/helpers/HoursHelper";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import type { TopBusinessesParams } from "./schemas/TopBusinessesParams";
import { TopBusinessesResponse } from "./schemas/TopBusinessesResponse";
import { TopBusinessesProvider } from "./TopBusinessesProvider";

export class TopBusinessesManager implements IManager {
  public constructor(private readonly provider = new TopBusinessesProvider()) {}

  public async getTopBusinesses(
    params: TopBusinessesParams,
  ): Promise<ManagerResponse<TopBusinessesResponse[] | null>> {
    const businesses = await this.provider.getTopBusinessesByArea(
      parseInt(params.neighborhoodId),
      BusinessConstants.TOP_BUSINESSES_COUNT,
    );
    const entities: BusinessEntity[] = [];
    for (const business of businesses) {
      let mediaEntity: MediaEntity | null = null;
      if (business.mediaId !== null) {
        const media = await this.provider.getBusinessMedia(business.businessId, business.mediaId);
        if (media === null) {
          return ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.BUSINESS_MEDIA_NOT_FOUND)],
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
      entities.push(new BusinessEntity(business, mediaEntity, serviceCategories, hoursToday));
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      TopBusinessesResponse.fromEntities(entities),
    );
  }
}
