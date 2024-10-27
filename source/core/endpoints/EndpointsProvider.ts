import type { ProviderResponse } from "../../@types/responses.d.ts";
import { RouteHelper } from "../../app/helpers/RouteHelper.ts";
import type { IProvider } from "../../app/interfaces/IProvider.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";
import type { EndpointsResponse } from "./schemas/EndpointsResponse.ts";

export class EndpointsProvider implements IProvider {
  public getEndpoints(): Promise<ProviderResponse<EndpointsResponse>> {
    return ResponseUtil.providerResponse(RouteHelper.getEndpoints());
  }
}
