import type { MediaData } from "../../../@types/medias";
import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { BusinessesServicesProvider } from "./BusinessesServicesProvider";
import type { BusinessesServicesParams } from "./schemas/BusinessesServicesParams";
import { BusinessesServicesResponse } from "./schemas/BusinessesServicesResponse";

export class BusinessesServicesManager implements IManager {
  public constructor(private readonly provider = new BusinessesServicesProvider()) {}

  public async getBusinessesServices(
    params: BusinessesServicesParams,
  ): Promise<ManagerResponse<BusinessesServicesResponse[] | null>> {
    const business = await this.provider.getBusiness(parseInt(params.businessId));
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_BUSINESS_FOUND)],
        null,
      );
    }
    const services = await this.provider.getServices(business.businessId);
    const responses: BusinessesServicesResponse[] = [];
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
      responses.push(BusinessesServicesResponse.fromModel(service, mediaData));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }
}
