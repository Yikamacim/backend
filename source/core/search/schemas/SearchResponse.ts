import type { MediaData } from "../../../@types/medias";
import type { IResponse } from "../../../app/interfaces/IResponse";
import type { BusinessServiceViewModel } from "../../../common/models/BusinessServiceViewModel";

export class SearchResponse implements IResponse {
  private constructor(
    public readonly businessId: number,
    public readonly name: string,
    public readonly media: MediaData | null,
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

  public static fromModel(
    model: BusinessServiceViewModel,
    media: MediaData | null,
  ): SearchResponse {
    return new SearchResponse(
      model.businessId,
      model.name,
      media,
      {
        countryName: model.countryName,
        provinceName: model.provinceName,
        districtName: model.districtName,
        neighborhoodName: model.neighborhoodName,
      },
      model.isOpen,
      model.stars,
      model.reviewsCount,
    );
  }
}
