import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { NeighbourhoodsProvider } from "./NeighbourhoodsProvider";
import type { NeighbourhoodsParams } from "./schemas/NeighbourhoodsParams";
import type { NeighbourhoodsQueries } from "./schemas/NeighbourhoodsQueries";
import { NeighbourhoodsResponse } from "./schemas/NeighbourhoodsResponse";

export class NeighbourhoodsManager implements IManager {
  public constructor(private readonly provider = new NeighbourhoodsProvider()) {}

  public async getNeighbourhoods(
    validatedData: NeighbourhoodsQueries,
  ): Promise<ManagerResponse<NeighbourhoodsResponse[]>> {
    // Get neighbourhoods by province id
    const prGetNeighbourhoodsByDistrictId = await this.provider.getNeighbourhoodsByDistrictId(
      parseInt(validatedData.districtId),
    );
    // Return neighbourhoods
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      NeighbourhoodsResponse.fromModels(prGetNeighbourhoodsByDistrictId.data),
    );
  }

  public async getNeighbourhoods$neighbourhoodId(
    validatedData: NeighbourhoodsParams,
  ): Promise<ManagerResponse<NeighbourhoodsResponse | null>> {
    // Try to get the neighbourhood
    const prGetNeighbourhoodById = await this.provider.getNeighbourhoodById(
      parseInt(validatedData.neighbourhoodId),
    );
    // If no neighbourhood found
    if (!prGetNeighbourhoodById.data) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_NEIGHBOURHOOD_FOUND)],
        null,
      );
    }
    // Return neighbourhood
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      NeighbourhoodsResponse.fromModel(prGetNeighbourhoodById.data),
    );
  }
}
