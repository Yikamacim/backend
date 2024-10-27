import type { ProviderResponse } from "../../@types/responses";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import type { EndpointsResponse } from "./schemas/EndpointsResponse";

export class EndpointsProvider implements IProvider {
  public getEndpoints(): Promise<ProviderResponse<EndpointsResponse>> {
    return ResponseUtil.providerResponse(RouteHelper.getEndpoints());
  }
}
