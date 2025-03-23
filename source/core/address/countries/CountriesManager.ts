import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { CountriesProvider } from "./CountriesProvider";
import type { CountriesParams } from "./schemas/CountriesParams";
import { CountriesResponse } from "./schemas/CountriesResponse";

export class CountriesManager implements IManager {
  public constructor(private readonly provider = new CountriesProvider()) {}

  public async getCountries(): Promise<ManagerResponse<CountriesResponse[]>> {
    // Get the countries
    const prGetCountries = await this.provider.getCountries();
    // Return countries
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      CountriesResponse.fromModels(prGetCountries.data),
    );
  }

  public async getCountries$countryId(
    validatedData: CountriesParams,
  ): Promise<ManagerResponse<CountriesResponse | null>> {
    // Try to get the country
    const prGetCountryById = await this.provider.getCountryById(parseInt(validatedData.countryId));
    // If no country found
    if (!prGetCountryById.data) {
      // Return with error
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_COUNTRY_FOUND)],
        null,
      );
    }
    // Return country
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      CountriesResponse.fromModel(prGetCountryById.data),
    );
  }
}
