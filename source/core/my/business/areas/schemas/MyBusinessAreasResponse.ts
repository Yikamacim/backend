import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { BusinessAreaViewModel } from "../../../../../common/models/BusinessAreaViewModel";

export class MyBusinessAreasResponse implements IResponse {
  private constructor(
    public readonly countryId: number,
    public readonly countryName: string,
    public readonly provinceId: number,
    public readonly provinceName: string,
    public readonly districtId: number,
    public readonly districtName: string,
    public readonly neighborhoodId: number,
    public readonly neighborhoodName: string,
    public readonly area: string,
  ) {}

  public static fromModel(model: BusinessAreaViewModel): MyBusinessAreasResponse {
    return new MyBusinessAreasResponse(
      model.countryId,
      model.countryName,
      model.provinceId,
      model.provinceName,
      model.districtId,
      model.districtName,
      model.neighborhoodId,
      model.neighborhoodName,
      model.area,
    );
  }

  public static fromModels(models: BusinessAreaViewModel[]): MyBusinessAreasResponse[] {
    return models.map((model: BusinessAreaViewModel) => MyBusinessAreasResponse.fromModel(model));
  }
}
