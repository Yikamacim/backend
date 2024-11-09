import type { ControllerResponse, ManagerResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { RecordsManager } from "./RecordsManager";
import type { RecordsResponse } from "./schemas/RecordsResponse";

export class RecordsController implements IController {
  private readonly mManager: RecordsManager;

  constructor() {
    this.mManager = new RecordsManager();
  }

  public async getRecords(
    _req: ExpressRequest,
    res: ControllerResponse<RecordsResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<RecordsResponse | null, null> | void> {
    try {
      // HAND OVER TO MANAGER
      const managerResponse: ManagerResponse<RecordsResponse | null> =
        await this.mManager.getRecords();
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

  public async deleteRecords(
    _req: ExpressRequest,
    res: ControllerResponse<null, null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<null, null> | void> {
    try {
      // HAND OVER TO MANAGER
      const managerResponse: ManagerResponse<null> = await this.mManager.deleteRecords();
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
