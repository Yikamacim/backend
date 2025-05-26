import type { IResponse } from "../../../app/interfaces/IResponse";
import type { CountryEntity } from "../../../common/entities/CountryEntity";

export class CountriesResponse implements IResponse {
  private constructor(
    public readonly countryId: number,
    public readonly name: string,
  ) {}

  public static fromEntity(entity: CountryEntity): CountriesResponse {
    return new CountriesResponse(entity.model.countryId, entity.model.name);
  }

  public static fromEntities(entities: CountryEntity[]): CountriesResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
