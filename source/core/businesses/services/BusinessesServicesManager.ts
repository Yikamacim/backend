import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { MediaEntity } from "../../../common/entities/MediaEntity";
import { ServiceEntity } from "../../../common/entities/ServiceEntity";
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
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
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
      BusinessesServicesResponse.fromEntities(entities),
    );
  }
}
