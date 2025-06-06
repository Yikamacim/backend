import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { CampaignModel } from "../../../../common/models/CampaignModel";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { CampaignProvider } from "../../../../common/providers/CampaignProvider";
import { MediaProvider } from "../../../../common/providers/MediaProvider";
import { CampaignQueries } from "../../../../common/queries/CampaignQueries";

export class MyBusinessCampaignsProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly mediaProvider = new MediaProvider(),
    private readonly campaignProvider = new CampaignProvider(),
  ) {
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
    this.getMedia = this.mediaProvider.getMedia.bind(this.mediaProvider);
    this.getCampaigns = this.campaignProvider.getCampaigns.bind(this.campaignProvider);
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;
  public readonly getMedia: typeof this.mediaProvider.getMedia;
  public readonly getCampaigns: typeof this.campaignProvider.getCampaigns;

  public async getCampaign(
    businessId: number,
    campaignId: number,
  ): Promise<ProviderResponse<CampaignModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CampaignQueries.GET_CAMPAIGN_$BSID_$CMID, [
        businessId,
        campaignId,
      ]);
      const record: unknown = results.rows[0];
      if (!record) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(CampaignModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createCampaign(
    businessId: number,
    title: string,
    mediaId: number,
    description: string,
  ): Promise<ProviderResponse<CampaignModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        CampaignQueries.INSERT_CAMPAIGN_RT_$BSID_$TITLE_$MDID_$DESC,
        [businessId, title, mediaId, description],
      );
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(CampaignModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteCampaign(campaignId: number): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(CampaignQueries.DELETE_CAMPAIGN_$CMID, [campaignId]);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
