import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { CampaignEntity } from "../../../../common/entities/CampaignEntity";
import type { EMediaType } from "../../../../common/enums/EMediaType";

export class BusinessesCampaignsResponse implements IResponse {
  private constructor(
    public readonly campaignId: number,
    public readonly title: string,
    public readonly media: {
      readonly mediaId: number;
      readonly mediaType: EMediaType;
      readonly extension: string;
      readonly url: string;
    },
    public readonly description: string,
    public readonly releaseDate: Date,
  ) {}

  public static fromEntity(entity: CampaignEntity): BusinessesCampaignsResponse {
    return new BusinessesCampaignsResponse(
      entity.model.campaignId,
      entity.model.title,
      entity.media,
      entity.model.description,
      entity.model.releaseDate,
    );
  }

  public static fromEntities(entities: CampaignEntity[]): BusinessesCampaignsResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
