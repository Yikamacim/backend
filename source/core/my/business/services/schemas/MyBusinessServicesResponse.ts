import type { MediaData } from "../../../../../@types/medias";
import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { ServiceCategory } from "../../../../../common/enums/ServiceCategory";
import type { ServiceModel } from "../../../../../common/models/ServiceModel";

export class MyBusinessServicesResponse implements IResponse {
  private constructor(
    public readonly serviceId: number,
    public readonly title: string,
    public readonly media: MediaData | null,
    public readonly serviceCategory: ServiceCategory,
    public readonly description: string,
    public readonly unitPrice: number,
  ) {}

  public static fromModel(
    model: ServiceModel,
    media: MediaData | null,
  ): MyBusinessServicesResponse {
    return new MyBusinessServicesResponse(
      model.serviceId,
      model.title,
      media,
      model.serviceCategory,
      model.description,
      model.unitPrice,
    );
  }
}
