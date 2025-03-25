import type { IResponse } from "../../../app/interfaces/IResponse";
import type { NeighbourhoodModel } from "../../../common/models/NeighbourhoodModel";

export class NeighbourhoodsResponse implements IResponse {
  private constructor(
    public readonly neighbourhoodId: number,
    public readonly districtId: number,
    public readonly name: string,
    public readonly postalCode: string,
  ) {}

  public static fromModel(model: NeighbourhoodModel): NeighbourhoodsResponse {
    return new NeighbourhoodsResponse(
      model.neighbourhoodId,
      model.districtId,
      model.name,
      model.postalCode,
    );
  }

  public static fromModels(models: NeighbourhoodModel[]): NeighbourhoodsResponse[] {
    return models.map((model: NeighbourhoodModel) => NeighbourhoodsResponse.fromModel(model));
  }
}
