import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { CampaignEntity } from "../../../common/entities/CampaignEntity";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { BusinessesCampaignsProvider } from "./BusinessesCampaignsProvider";
import type { BusinessesCampaignsParams } from "./schemas/BusinessesCampaignsParams";
import { BusinessesCampaignsResponse } from "./schemas/BusinessesCampaignsResponse";

export class BusinessesCampaignsManager implements IManager {
  public constructor(private readonly provider = new BusinessesCampaignsProvider()) {}

  public async getBusinessesCampaigns(
    params: BusinessesCampaignsParams,
  ): Promise<ManagerResponse<BusinessesCampaignsResponse[] | null>> {
    const business = await this.provider.getBusiness(parseInt(params.businessId));
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const campaigns = await this.provider.getCampaigns(business.businessId);
    const entities: CampaignEntity[] = [];
    for (const campaign of campaigns) {
      const media = await this.provider.getMedia(campaign.mediaId);
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.BUSINESS_MEDIA_NOT_FOUND)],
          null,
        );
      }
      const mediaEntity = await MediaHelper.mediaToEntity(media);
      entities.push(new CampaignEntity(campaign, mediaEntity));
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      BusinessesCampaignsResponse.fromEntities(entities),
    );
  }
}
