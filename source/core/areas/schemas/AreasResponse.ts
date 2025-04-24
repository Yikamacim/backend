import type { IResponse } from "../../../app/interfaces/IResponse";
import type { AreaViewModel } from "../../../common/models/AreaViewModel";

export class AreasResponse implements IResponse {
  private constructor(
    public readonly countryId: number,
    public readonly countryName: string,
    public readonly provinceId: number,
    public readonly provinceName: string,
    public readonly districtId: number,
    public readonly districtName: string,
    public readonly neighborhoodId: number,
    public readonly neighborhoodName: string,
    public readonly areas: string,
  ) {}

  public static fromModel(model: AreaViewModel): AreasResponse {
    return new AreasResponse(
      model.countryId,
      model.countryName,
      model.provinceId,
      model.provinceName,
      model.districtId,
      model.districtName,
      model.neighborhoodId,
      model.neighborhoodName,
      model.areas,
    );
  }

  public static fromModels(models: AreaViewModel[]): AreasResponse[] {
    return models.map((model: AreaViewModel) => AreasResponse.fromModel(model));
  }
}
