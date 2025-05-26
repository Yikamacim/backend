import type { IResponse } from "../../../app/interfaces/IResponse";
import type { NeighborhoodEntity } from "../../../common/entities/NeighborhoodEntity";

export class NeighborhoodsResponse implements IResponse {
  private constructor(
    public readonly neighborhoodId: number,
    public readonly districtId: number,
    public readonly name: string,
    public readonly postalCode: string,
  ) {}

  public static fromEntity(entity: NeighborhoodEntity): NeighborhoodsResponse {
    return new NeighborhoodsResponse(
      entity.model.neighborhoodId,
      entity.model.districtId,
      entity.model.name,
      entity.model.postalCode,
    );
  }

  public static fromEntities(entities: NeighborhoodEntity[]): NeighborhoodsResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
