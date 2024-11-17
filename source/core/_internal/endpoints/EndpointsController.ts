import type { ControllerResponse } from "../../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import type { IController } from "../../../app/interfaces/IController";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { EndpointsManager } from "./EndpointsManager";
import type { EndpointsResponse } from "./schemas/EndpointsResponse";

export class EndpointsController implements IController {
  public constructor(private readonly manager = new EndpointsManager()) {}

  public async getEndpoints(
    _: ExpressRequest,
    res: ControllerResponse<EndpointsResponse, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< HAND OVER TO MANAGER >-----------<
      const mrGetEndpoints = await this.manager.getEndpoints();
      // Successful response
      return ResponseUtil.controllerResponse(
        res,
        mrGetEndpoints.httpStatus,
        mrGetEndpoints.serverError,
        mrGetEndpoints.clientErrors,
        mrGetEndpoints.data,
        null,
        false,
      );
    } catch (error) {
      return next(error);
    }
  }
}
