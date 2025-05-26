import type { IResponse } from "../../../app/interfaces/IResponse";
import type { SearchEntity } from "../../../common/entities/SearchEntity";
import type { EMediaType } from "../../../common/enums/EMediaType";

export class SearchResponse implements IResponse {
  private constructor(
    public readonly businessId: number,
    public readonly name: string,
    public readonly media: {
      readonly mediaId: number;
      readonly mediaType: EMediaType;
      readonly extension: string;
      readonly url: string;
    } | null,
    public readonly address: {
      readonly countryName: string;
      readonly provinceName: string;
      readonly districtName: string;
      readonly neighborhoodName: string;
    },
    public readonly isOpen: boolean,
    public readonly stars: number | null,
    public readonly reviewsCount: number,
  ) {}

  public static fromEntity(entity: SearchEntity): SearchResponse {
    return new SearchResponse(
      entity.model.businessId,
      entity.model.name,
      entity.media,
      {
        countryName: entity.model.countryName,
        provinceName: entity.model.provinceName,
        districtName: entity.model.districtName,
        neighborhoodName: entity.model.neighborhoodName,
      },
      entity.model.isOpen,
      entity.model.stars,
      entity.model.reviewsCount,
    );
  }

  public static fromEntities(entities: SearchEntity[]): SearchResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
