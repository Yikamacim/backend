import type { IProvider } from "../../../app/interfaces/IProvider";
import { BusinessProvider } from "../../../common/providers/BusinessProvider";
import { CampaignProvider } from "../../../common/providers/CampaignProvider";
import { MediaProvider } from "../../../common/providers/MediaProvider";

export class BusinessesCampaignsProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly mediaProvider = new MediaProvider(),
    private readonly campaignProvider = new CampaignProvider(),
  ) {
    this.getBusiness = this.businessProvider.getBusiness.bind(this.businessProvider);
    this.getMedia = this.mediaProvider.getMedia.bind(this.mediaProvider);
    this.getCampaigns = this.campaignProvider.getCampaigns.bind(this.campaignProvider);
  }

  public readonly getBusiness: typeof this.businessProvider.getBusiness;
  public readonly getMedia: typeof this.mediaProvider.getMedia;
  public readonly getCampaigns: typeof this.campaignProvider.getCampaigns;
}
