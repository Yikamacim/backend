import type { TodayHours } from "../../../../@types/hours";
import type { MediaData } from "../../../../@types/medias";
import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { ApprovalState } from "../../../../common/enums/ApprovalState";
import type { ServiceCategory } from "../../../../common/enums/ServiceCategory";
import type { BusinessViewModel } from "../../../../common/models/BusinessViewModel";

export class BusinessesResponse implements IResponse {
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
    public readonly description: string,
    public readonly isOpen: boolean,
    public readonly stars: number | null,
    public readonly reviewsCount: number,
    public readonly approvalState: ApprovalState | null,
    public readonly serviceCategories: ServiceCategory[],
    public readonly todayHours: TodayHours | null,
  ) {}

  public static fromModel(
    model: BusinessViewModel,
    media: MediaData | null,
    serviceCategories: ServiceCategory[],
    todayHours: TodayHours | null,
  ): BusinessesResponse {
    return new BusinessesResponse(
      model.businessId,
      model.name,
      media,
      {
        countryName: model.countryName,
        provinceName: model.provinceName,
        districtName: model.districtName,
        neighborhoodName: model.neighborhoodName,
      },
      model.description,
      model.isOpen,
      model.stars,
      model.reviewsCount,
      model.approvalState,
      serviceCategories,
      todayHours,
    );
  }
}
