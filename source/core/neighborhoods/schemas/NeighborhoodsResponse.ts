import type { IResponse } from "../../../app/interfaces/IResponse";
import type { NeighborhoodModel } from "../../../common/models/NeighborhoodModel";

export class NeighborhoodsResponse implements IResponse {
  private constructor(
    public readonly neighborhoodId: number,
    public readonly districtId: number,
    public readonly name: string,
    public readonly postalCode: string,
  ) {}

  public static fromModel(model: NeighborhoodModel): NeighborhoodsResponse {
    return new NeighborhoodsResponse(
      model.neighborhoodId,
      model.districtId,
      model.name,
      model.postalCode,
    );
  }

  public static fromModels(models: NeighborhoodModel[]): NeighborhoodsResponse[] {
    return models.map((model: NeighborhoodModel) => NeighborhoodsResponse.fromModel(model));
  }
}
