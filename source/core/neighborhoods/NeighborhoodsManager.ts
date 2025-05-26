import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { NeighborhoodEntity } from "../../common/entities/NeighborhoodEntity";
import { NeighborhoodsProvider } from "./NeighborhoodsProvider";
import type { NeighborhoodsParams } from "./schemas/NeighborhoodsParams";
import type { NeighborhoodsQueries } from "./schemas/NeighborhoodsQueries";
import { NeighborhoodsResponse } from "./schemas/NeighborhoodsResponse";

export class NeighborhoodsManager implements IManager {
  public constructor(private readonly provider = new NeighborhoodsProvider()) {}

  public async getNeighborhoods(
    queries: NeighborhoodsQueries,
  ): Promise<ManagerResponse<NeighborhoodsResponse[]>> {
    const neighborhoods = await this.provider.getNeighborhoodsByDistrictId(
      parseInt(queries.districtId),
    );
    const entities = neighborhoods.map((neighborhood) => {
      return new NeighborhoodEntity(neighborhood);
    });
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      NeighborhoodsResponse.fromEntities(entities),
    );
  }

  public async getNeighborhoods$(
    params: NeighborhoodsParams,
  ): Promise<ManagerResponse<NeighborhoodsResponse | null>> {
    const neighborhood = await this.provider.getNeighborhood(parseInt(params.neighborhoodId));
    if (neighborhood === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_NEIGHBORHOOD_FOUND)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      NeighborhoodsResponse.fromEntity(new NeighborhoodEntity(neighborhood)),
    );
  }
}
