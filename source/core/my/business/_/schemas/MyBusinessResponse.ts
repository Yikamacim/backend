import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { BusinessEntity } from "../../../../../common/entities/BusinessEntity";
import type { EApprovalState } from "../../../../../common/enums/EApprovalState";
import type { EMediaType } from "../../../../../common/enums/EMediaType";
import type { EServiceCategory } from "../../../../../common/enums/EServiceCategory";

export class MyBusinessResponse implements IResponse {
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
    public readonly approvalState: EApprovalState | null,
    public readonly serviceCategories: EServiceCategory[],
    public readonly hoursToday: {
      readonly from: string | null;
      readonly to: string | null;
    } | null,
  ) {}

  public static fromEntity(entity: BusinessEntity): MyBusinessResponse {
    return new MyBusinessResponse(
      entity.model.businessId,
      entity.model.name,
      entity.media,
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
      entity.model.phone,
      entity.model.email,
      entity.model.description,
      entity.model.isOpen,
      entity.model.stars,
      entity.model.reviewsCount,
      entity.model.approvalState,
      entity.serviceCategories,
      entity.todayHours,
    );
  }

  public static fromEntities(entities: BusinessEntity[]): MyBusinessResponse[] {
    return entities.map((entity) => MyBusinessResponse.fromEntity(entity));
  }
}
