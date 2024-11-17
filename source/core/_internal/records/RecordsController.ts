import type { ControllerResponse } from "../../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import type { IController } from "../../../app/interfaces/IController";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { RecordsManager } from "./RecordsManager";
import type { RecordsResponse } from "./schemas/RecordsResponse";

export class RecordsController implements IController {
  public constructor(private readonly manager = new RecordsManager()) {
    this.manager = new RecordsManager();
  }

  public async getRecords(
    _: ExpressRequest,
    res: ControllerResponse<RecordsResponse, null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<RecordsResponse, null> | void> {
    try {
      // >-----------< HAND OVER TO MANAGER >-----------<
      const mrGetRecords = await this.manager.getRecords();
      // Successful response
      return ResponseUtil.controllerResponse(
        res,
        mrGetRecords.httpStatus,
        mrGetRecords.serverError,
        mrGetRecords.clientErrors,
        mrGetRecords.data,
        null,
        false,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async deleteRecords(
    _req: ExpressRequest,
    res: ControllerResponse<null, null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<null, null> | void> {
    try {
      // HAND OVER TO MANAGER
      const managerResponse = await this.manager.deleteRecords();
      // Check manager response
      if (!managerResponse.httpStatus.isSuccess()) {
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
        null,
        null,
        false,
      );
    } catch (error) {
      return next(error);
    }
  }
}
