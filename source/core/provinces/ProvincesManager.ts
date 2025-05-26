import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { ProvinceEntity } from "../../common/entities/ProvinceEntity";
import { ProvincesProvider } from "./ProvincesProvider";
import type { ProvincesParams } from "./schemas/ProvincesParams";
import type { ProvincesQueries } from "./schemas/ProvincesQueries";
import { ProvincesResponse } from "./schemas/ProvincesResponse";

export class ProvincesManager implements IManager {
  public constructor(private readonly provider = new ProvincesProvider()) {}

  public async getProvinces(
    queries: ProvincesQueries,
  ): Promise<ManagerResponse<ProvincesResponse[]>> {
    const provinces = await this.provider.getProvincesByCountryId(parseInt(queries.countryId));
    const entities = provinces.map((province) => {
      return new ProvinceEntity(province);
    });
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      ProvincesResponse.fromEntities(entities),
    );
  }

  public async getProvinces$(
    params: ProvincesParams,
  ): Promise<ManagerResponse<ProvincesResponse | null>> {
    const province = await this.provider.getProvince(parseInt(params.provinceId));
    if (province === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_PROVINCE_FOUND)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      ProvincesResponse.fromEntity(new ProvinceEntity(province)),
    );
  }
}
