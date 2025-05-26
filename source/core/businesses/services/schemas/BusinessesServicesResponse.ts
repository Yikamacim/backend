import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { ServiceEntity } from "../../../../common/entities/ServiceEntity";
import type { EMediaType } from "../../../../common/enums/EMediaType";
import type { EServiceCategory } from "../../../../common/enums/EServiceCategory";

export class BusinessesServicesResponse implements IResponse {
  private constructor(
    public readonly serviceId: number,
    public readonly title: string,
    public readonly media: {
      readonly mediaId: number;
      readonly mediaType: EMediaType;
      readonly extension: string;
      readonly url: string;
    } | null,
    public readonly serviceCategory: EServiceCategory,
    public readonly description: string,
    public readonly unitPrice: number,
  ) {}

  public static fromEntity(entity: ServiceEntity): BusinessesServicesResponse {
    return new BusinessesServicesResponse(
      entity.model.serviceId,
      entity.model.title,
      entity.media,
      entity.model.serviceCategory,
      entity.model.description,
      entity.model.unitPrice,
    );
  }

  public static fromEntities(entities: ServiceEntity[]): BusinessesServicesResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
