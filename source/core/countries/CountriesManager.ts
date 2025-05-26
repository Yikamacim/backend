import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { CountryEntity } from "../../common/entities/CountryEntity";
import { CountriesProvider } from "./CountriesProvider";
import type { CountriesParams } from "./schemas/CountriesParams";
import { CountriesResponse } from "./schemas/CountriesResponse";

export class CountriesManager implements IManager {
  public constructor(private readonly provider = new CountriesProvider()) {}

  public async getCountries(): Promise<ManagerResponse<CountriesResponse[]>> {
    const countries = await this.provider.getCountries();
    const entites = countries.map((country) => {
      return new CountryEntity(country);
    });
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      CountriesResponse.fromEntities(entites),
    );
  }

  public async getCountries$(
    params: CountriesParams,
  ): Promise<ManagerResponse<CountriesResponse | null>> {
    const country = await this.provider.getCountry(parseInt(params.countryId));
    if (country === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_COUNTRY_FOUND)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      CountriesResponse.fromEntity(new CountryEntity(country)),
    );
  }
}
