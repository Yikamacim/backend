import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { CountryModel } from "../../../../common/models/CountryModel";

export class CountriesResponse implements IResponse {
  private constructor(
    public readonly countryId: number,
    public readonly name: string,
  ) {}

  public static fromModel(model: CountryModel): CountriesResponse {
    return new CountriesResponse(model.countryId, model.name);
  }

  public static fromModels(models: CountryModel[]): CountriesResponse[] {
    return models.map((model: CountryModel) => CountriesResponse.fromModel(model));
  }
}
