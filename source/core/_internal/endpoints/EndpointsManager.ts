import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { EndpointsProvider } from "./EndpointsProvider";
import type { EndpointsResponse } from "./schemas/EndpointsResponse";

export class EndpointsManager implements IManager {
  public constructor(private readonly provider = new EndpointsProvider()) {}

  public async getEndpoints(): Promise<ManagerResponse<EndpointsResponse>> {
    // Get endpoints
    const prGetEndpoints = await this.provider.getEndpoints();
    // Return endpoints
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      prGetEndpoints.data,
    );
  }
}
