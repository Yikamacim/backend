import type { IResponse } from "../../../app/interfaces/IResponse";
import type { ProvinceModel } from "../../../common/models/ProvinceModel";

export class ProvincesResponse implements IResponse {
  private constructor(
    public readonly provinceId: number,
    public readonly countryId: number,
    public readonly name: string,
  ) {}

  public static fromModel(model: ProvinceModel): ProvincesResponse {
    return new ProvincesResponse(model.provinceId, model.countryId, model.name);
  }

  public static fromModels(models: ProvinceModel[]): ProvincesResponse[] {
    return models.map((model: ProvinceModel) => ProvincesResponse.fromModel(model));
  }
}
