import type { MediaData } from "../../../../../@types/medias";
import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { ApprovalState } from "../../../../../common/enums/ApprovalState";
import type { BusinessViewModel } from "../../../../../common/models/BusinessViewModel";

export class MyBusinessResponse implements IResponse {
  private constructor(
    public readonly businessId: number,
    public readonly name: string,
    public readonly media: MediaData | null,
    public readonly address: {
      readonly countryId: number;
      readonly countryName: string;
      readonly provinceId: number;
      readonly provinceName: string;
      readonly districtId: number;
      readonly districtName: string;
      readonly neighborhoodId: number;
      readonly neighborhoodName: string;
      readonly explicitAddress: string;
    },
    public readonly phone: string,
    public readonly email: string,
    public readonly description: string,
    public readonly isOpen: boolean,
    public readonly stars: number | null,
    public readonly reviewsCount: number,
    public readonly approvalState: ApprovalState | null,
  ) {}

  public static fromModel(model: BusinessViewModel, media: MediaData | null): MyBusinessResponse {
    return new MyBusinessResponse(
      model.businessId,
      model.name,
      media,
      {
        countryId: model.countryId,
        countryName: model.countryName,
        provinceId: model.provinceId,
        provinceName: model.provinceName,
        districtId: model.districtId,
        districtName: model.districtName,
        neighborhoodId: model.neighborhoodId,
        neighborhoodName: model.neighborhoodName,
        explicitAddress: model.explicitAddress,
      },
      model.phone,
      model.email,
      model.description,
      model.isOpen,
      model.stars,
      model.reviewsCount,
      model.approvalState,
    );
  }
}
