import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { AboutEntity } from "../../../../common/entities/AboutEntity";

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

  public static fromEntity(entity: AboutEntity): BusinessesAboutResponse {
    return new BusinessesAboutResponse(
      entity.model.phone,
      entity.model.email,
      {
        countryId: entity.model.countryId,
        countryName: entity.model.countryName,
        provinceId: entity.model.provinceId,
        provinceName: entity.model.provinceName,
        districtId: entity.model.districtId,
        districtName: entity.model.districtName,
        neighborhoodId: entity.model.neighborhoodId,
        neighborhoodName: entity.model.neighborhoodName,
        explicitAddress: entity.model.explicitAddress,
      },
      entity.hours,
    );
  }

  public static fromEntities(entities: AboutEntity[]): BusinessesAboutResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
