import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { DistrictModel } from "../../../../common/models/DistrictModel";

export class DistrictsResponse implements IResponse {
  private constructor(
    public readonly districtId: number,
    public readonly provinceId: number,
    public readonly name: string,
  ) {}

  public static fromModel(model: DistrictModel): DistrictsResponse {
    return new DistrictsResponse(model.districtId, model.provinceId, model.name);
  }

  public static fromModels(models: DistrictModel[]): DistrictsResponse[] {
    return models.map((model: DistrictModel) => DistrictsResponse.fromModel(model));
  }
}
