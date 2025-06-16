import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { CampaignAreaModel } from "../../common/models/CampaignAreaModel";
import { MediaProvider } from "../../common/providers/MediaProvider";
import { CampaignAreaViewQueries } from "../../common/queries/CampaignAreaViewQueries";

export class CampaignsProvider implements IProvider {
  public constructor(private readonly mediaProvider = new MediaProvider()) {
    this.getMedia = this.mediaProvider.getMedia.bind(this.mediaProvider);
  }

  public readonly getMedia: typeof this.mediaProvider.getMedia;

  public async getCampaignsByArea(
    neighborhoodId: number,
  ): Promise<ProviderResponse<CampaignAreaModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        CampaignAreaViewQueries.GET_CAMPAIGN_AREAS_$NBID,
        [neighborhoodId],
      );
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(CampaignAreaModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
