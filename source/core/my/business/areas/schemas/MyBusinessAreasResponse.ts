import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { AreaEntity } from "../../../../../common/entities/AreaEntity";

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

  public static fromEntity(entity: AreaEntity): MyBusinessAreasResponse {
    return new MyBusinessAreasResponse(
      entity.model.countryId,
      entity.model.countryName,
      entity.model.provinceId,
      entity.model.provinceName,
      entity.model.districtId,
      entity.model.districtName,
      entity.model.neighborhoodId,
      entity.model.neighborhoodName,
      entity.model.area,
    );
  }

  public static fromEntities(entities: AreaEntity[]): MyBusinessAreasResponse[] {
    return entities.map((entity: AreaEntity) => MyBusinessAreasResponse.fromEntity(entity));
  }
}
