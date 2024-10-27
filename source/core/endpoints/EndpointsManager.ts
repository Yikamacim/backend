import type { ManagerResponse, ProviderResponse } from "../../@types/responses.d.ts";
import type { IManager } from "../../app/interfaces/IManager.ts";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";
import { EndpointsProvider } from "./EndpointsProvider.ts";
import type { EndpointsResponse } from "./schemas/EndpointsResponse.ts";

export class EndpointsManager implements IManager {
  private readonly mProvider: EndpointsProvider;

  constructor() {
    this.mProvider = new EndpointsProvider();
  }

  public async getEndpoints(): Promise<ManagerResponse<EndpointsResponse | null>> {
    // HAND OVER TO PROVIDER
    const providerResponse: ProviderResponse<EndpointsResponse> = await this.mProvider.getEndpoints();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      providerResponse.data,
    );
  }
}
