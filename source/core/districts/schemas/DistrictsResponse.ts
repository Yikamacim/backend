import type { IResponse } from "../../../app/interfaces/IResponse";
import type { DistrictEntity } from "../../../common/entities/DistrictEntity";

export class DistrictsResponse implements IResponse {
  private constructor(
    public readonly districtId: number,
    public readonly provinceId: number,
    public readonly name: string,
  ) {}

  public static fromEntity(entity: DistrictEntity): DistrictsResponse {
    return new DistrictsResponse(
      entity.model.districtId,
      entity.model.provinceId,
      entity.model.name,
    );
  }

  public static fromEntities(entities: DistrictEntity[]): DistrictsResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
