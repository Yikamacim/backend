import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { DistrictsProvider } from "./DistrictsProvider";
import type { DistrictsParams } from "./schemas/DistrictsParams";
import type { DistrictsQueries } from "./schemas/DistrictsQueries";
import { DistrictsResponse } from "./schemas/DistrictsResponse";

export class DistrictsManager implements IManager {
  public constructor(private readonly provider = new DistrictsProvider()) {}

  public async getDistricts$provinceId(
    validatedData: DistrictsQueries,
  ): Promise<ManagerResponse<DistrictsResponse[]>> {
    // Get the districts by province id
    const prGetDistrictsByProvinceId = await this.provider.getDistrictsByProvinceId(
      parseInt(validatedData.provinceId),
    );
    // Return districts
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      DistrictsResponse.fromModels(prGetDistrictsByProvinceId.data),
    );
  }

  public async getDistricts$districtId(
    validatedData: DistrictsParams,
  ): Promise<ManagerResponse<DistrictsResponse | null>> {
    // Try to get the district
    const prGetDistrictById = await this.provider.getDistrictById(
      parseInt(validatedData.districtId),
    );
    // If no district found
    if (!prGetDistrictById.data) {
      // Return with error
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_COUNTRY_FOUND)],
        null,
      );
    }
    // Return district
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      DistrictsResponse.fromModel(prGetDistrictById.data),
    );
  }
}
