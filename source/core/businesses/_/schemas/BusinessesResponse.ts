import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { BusinessEntity } from "../../../../common/entities/BusinessEntity";
import type { EApprovalState } from "../../../../common/enums/EApprovalState";
import type { EMediaType } from "../../../../common/enums/EMediaType";
import type { EServiceCategory } from "../../../../common/enums/EServiceCategory";

export class BusinessesResponse implements IResponse {
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

  public static fromEntity(entity: BusinessEntity): BusinessesResponse {
    return new BusinessesResponse(
      entity.model.businessId,
      entity.model.name,
      entity.media,
      {
        countryName: entity.model.countryName,
        provinceName: entity.model.provinceName,
        districtName: entity.model.districtName,
        neighborhoodName: entity.model.neighborhoodName,
      },
      entity.model.description,
      entity.model.isOpen,
      entity.model.stars,
      entity.model.reviewsCount,
      entity.model.approvalState,
      entity.serviceCategories,
      entity.todayHours,
    );
  }

  public static fromEntities(entities: BusinessEntity[]): BusinessesResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
