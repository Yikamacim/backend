import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { ProvincesProvider } from "./ProvincesProvider";
import type { ProvincesParams } from "./schemas/ProvincesParams";
import type { ProvincesQueries } from "./schemas/ProvincesQueries";
import { ProvincesResponse } from "./schemas/ProvincesResponse";

export class ProvincesManager implements IManager {
  public constructor(private readonly provider = new ProvincesProvider()) {}

  public async getProvinces$countryId(
    validatedData: ProvincesQueries,
  ): Promise<ManagerResponse<ProvincesResponse[]>> {
    // Get the Provinces by province id
    const prGetProvincesByCountryId = await this.provider.getProvincesByCountryId(
      parseInt(validatedData.countryId),
    );
    // Return Provinces
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      ProvincesResponse.fromModels(prGetProvincesByCountryId.data),
    );
  }

  public async getProvinces$provinceId(
    validatedData: ProvincesParams,
  ): Promise<ManagerResponse<ProvincesResponse | null>> {
    // Try to get the province
    const prGetProvinceById = await this.provider.getProvinceById(
      parseInt(validatedData.provinceId),
    );
    // If no province found
    if (!prGetProvinceById.data) {
      // Return with error
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_PROVINCE_FOUND)],
        null,
      );
    }
    // Return province
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      ProvincesResponse.fromModel(prGetProvinceById.data),
    );
  }
}
