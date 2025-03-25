import type { ControllerResponse } from "../../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { EndpointsResponse } from "./schemas/EndpointsResponse";

export class EndpointsController implements IController {
  public async getEndpoints(
    _: ExpressRequest,
    res: ControllerResponse<EndpointsResponse, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< RESPONSE >----------<
      return ResponseUtil.controllerResponse(
        res,
        new HttpStatus(HttpStatusCode.OK),
        null,
        [],
        await RouteHelper.getEndpoints(),
        null,
        false,
      );
    } catch (error) {
      return next(error);
    }
  }
}
