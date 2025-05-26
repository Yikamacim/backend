import type { IResponse } from "../../../app/interfaces/IResponse";
import type { ProvinceEntity } from "../../../common/entities/ProvinceEntity";

export class ProvincesResponse implements IResponse {
  private constructor(
    public readonly provinceId: number,
    public readonly countryId: number,
    public readonly name: string,
  ) {}

  public static fromEntity(entity: ProvinceEntity): ProvincesResponse {
    return new ProvincesResponse(
      entity.model.provinceId,
      entity.model.countryId,
      entity.model.name,
    );
  }

  public static fromEntities(entities: ProvinceEntity[]): ProvincesResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
