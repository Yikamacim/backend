import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { DistrictEntity } from "../../common/entities/DistrictEntity";
import { DistrictsProvider } from "./DistrictsProvider";
import type { DistrictsParams } from "./schemas/DistrictsParams";
import type { DistrictsQueries } from "./schemas/DistrictsQueries";
import { DistrictsResponse } from "./schemas/DistrictsResponse";

export class DistrictsManager implements IManager {
  public constructor(private readonly provider = new DistrictsProvider()) {}

  public async getDistricts(
    queries: DistrictsQueries,
  ): Promise<ManagerResponse<DistrictsResponse[]>> {
    const districts = await this.provider.getDistrictsByProvinceId(parseInt(queries.provinceId));
    const entities = districts.map((district) => {
      return new DistrictEntity(district);
    });
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      DistrictsResponse.fromEntities(entities),
    );
  }

  public async getDistricts$(
    params: DistrictsParams,
  ): Promise<ManagerResponse<DistrictsResponse | null>> {
    const district = await this.provider.getDistrict(parseInt(params.districtId));
    if (district === null) {
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
      DistrictsResponse.fromEntity(new DistrictEntity(district)),
    );
  }
}
