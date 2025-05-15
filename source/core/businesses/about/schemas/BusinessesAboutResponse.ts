import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { BusinessViewModel } from "../../../../common/models/BusinessViewModel";
import type { HoursModel } from "../../../../common/models/HoursModel";

export class BusinessesAboutResponse implements IResponse {
  private constructor(
    public readonly phone: string,
    public readonly email: string,
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
    public readonly hours: {
      readonly mondayFrom: string | null;
      readonly mondayTo: string | null;
      readonly tuesdayFrom: string | null;
      readonly tuesdayTo: string | null;
      readonly wednesdayFrom: string | null;
      readonly wednesdayTo: string | null;
      readonly thursdayFrom: string | null;
      readonly thursdayTo: string | null;
      readonly fridayFrom: string | null;
      readonly fridayTo: string | null;
      readonly saturdayFrom: string | null;
      readonly saturdayTo: string | null;
      readonly sundayFrom: string | null;
      readonly sundayTo: string | null;
    } | null,
  ) {}

  public static fromModel(
    model: BusinessViewModel,
    hours: HoursModel | null,
  ): BusinessesAboutResponse {
    return new BusinessesAboutResponse(
      model.phone,
      model.email,
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
      hours,
    );
  }
}
