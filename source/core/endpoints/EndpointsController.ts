import type { ControllerResponse, ManagerResponse } from "../../@types/responses.d.ts";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.d.ts";
import type { IController } from "../../app/interfaces/IController.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";
import { EndpointsManager } from "./EndpointsManager.ts";
import type { EndpointsResponse } from "./schemas/EndpointsResponse.ts";

export class EndpointsController implements IController {
  private readonly mManager: EndpointsManager;

  constructor() {
    this.mManager = new EndpointsManager();
  }

  public async getEndpoints(
    _req: ExpressRequest,
    res: ControllerResponse<EndpointsResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<EndpointsResponse | null, null> | void> {
    try {
      // HAND OVER TO MANAGER
      const managerResponse: ManagerResponse<EndpointsResponse | null> = await this.mManager
        .getEndpoints();
      // Check manager response
      if (!managerResponse.httpStatus.isSuccess() || !managerResponse.data) {
        // Unsuccessful response
        return ResponseUtil.controllerResponse(
          res,
          managerResponse.httpStatus,
          managerResponse.serverError,
          managerResponse.clientErrors,
          null,
          null,
        );
      }
      // Successful response
      return ResponseUtil.controllerResponse(
        res,
        managerResponse.httpStatus,
        managerResponse.serverError,
        managerResponse.clientErrors,
        managerResponse.data,
        null,
        false,
      );
    } catch (error) {
      return next(error);
    }
  }
}