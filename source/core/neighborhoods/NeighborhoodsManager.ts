import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { NeighborhoodsProvider } from "./NeighborhoodsProvider";
import type { NeighborhoodsParams } from "./schemas/NeighborhoodsParams";
import type { NeighborhoodsQueries } from "./schemas/NeighborhoodsQueries";
import { NeighborhoodsResponse } from "./schemas/NeighborhoodsResponse";

export class NeighborhoodsManager implements IManager {
  public constructor(private readonly provider = new NeighborhoodsProvider()) {}

  public async getNeighborhoods(
    validatedData: NeighborhoodsQueries,
  ): Promise<ManagerResponse<NeighborhoodsResponse[]>> {
    // Get neighborhoods by province id
    const prGetNeighborhoodsByDistrictId = await this.provider.getNeighborhoodsByDistrictId(
      parseInt(validatedData.districtId),
    );
    // Return neighborhoods
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      NeighborhoodsResponse.fromModels(prGetNeighborhoodsByDistrictId.data),
    );
  }

  public async getNeighborhoods$neighborhoodId(
    validatedData: NeighborhoodsParams,
  ): Promise<ManagerResponse<NeighborhoodsResponse | null>> {
    // Try to get the neighborhood
    const prGetNeighborhoodById = await this.provider.getNeighborhoodById(
      parseInt(validatedData.neighborhoodId),
    );
    // If no neighborhood found
    if (!prGetNeighborhoodById.data) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_NEIGHBORHOOD_FOUND)],
        null,
      );
    }
    // Return neighborhood
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      NeighborhoodsResponse.fromModel(prGetNeighborhoodById.data),
    );
  }
}
