import type { ManagerResponse, ProviderResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { EndpointsProvider } from "./EndpointsProvider";
import type { EndpointsResponse } from "./schemas/EndpointsResponse";

export class EndpointsManager implements IManager {
  private readonly mProvider: EndpointsProvider;

  constructor() {
    this.mProvider = new EndpointsProvider();
  }

  public async getEndpoints(): Promise<ManagerResponse<EndpointsResponse | null>> {
    // HAND OVER TO PROVIDER
    const providerResponse: ProviderResponse<EndpointsResponse> =
      await this.mProvider.getEndpoints();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      providerResponse.data,
    );
  }
}
