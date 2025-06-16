import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { CampaignEntity } from "../../common/entities/CampaignEntity";
import { MediaHelper } from "../../common/helpers/MediaHelper";
import { CampaignsProvider } from "./CampaignsProvider";
import type { CampaignsParams } from "./schemas/CampaignsParams";
import { CampaignsResponse } from "./schemas/CampaignsResponse";

export class CampaignsManager implements IManager {
  public constructor(private readonly provider = new CampaignsProvider()) {}

  public async getCampaigns(
    params: CampaignsParams,
  ): Promise<ManagerResponse<CampaignsResponse[] | null>> {
    const campaigns = await this.provider.getCampaignsByArea(parseInt(params.neighborhoodId));
    const entities: CampaignEntity[] = [];
    for (const campaign of campaigns) {
      const media = await this.provider.getMedia(campaign.mediaId);
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_UPLOADED)],
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
      CampaignsResponse.fromEntities(entities),
    );
  }
}
