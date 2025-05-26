import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AreaEntity } from "../../common/entities/AreaEntity";
import { AreasProvider } from "./AreasProvider";
import type { AreasQueries } from "./schemas/AreasQueries";
import { AreasResponse } from "./schemas/AreasResponse";

export class AreasManager implements IManager {
  public constructor(private readonly provider = new AreasProvider()) {}

  public async getAreas(queries: AreasQueries): Promise<ManagerResponse<AreasResponse[]>> {
    const locations = await this.provider.searchAreas(queries.query);
    const entities = locations.map((location) => {
      return new AreaEntity(location);
    });
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      AreasResponse.fromEntities(entities),
    );
  }
}
