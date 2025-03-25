import type { ControllerResponse } from "../../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import { LogHelper } from "../../../app/helpers/LogHelper";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { RecordsResponse } from "./schemas/RecordsResponse";

export class RecordsController implements IController {
  public async getRecords(
    _: ExpressRequest,
    res: ControllerResponse<RecordsResponse, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< RESPONSE >----------<
      return ResponseUtil.controllerResponse(
        res,
        new HttpStatus(HttpStatusCode.OK),
        null,
        [],
        await LogHelper.getRecords(),
        null,
        false,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async deleteRecords(
    _: ExpressRequest,
    res: ControllerResponse<null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< LOGIC >----------<
      await LogHelper.deleteRecords();
      // >----------< RESPONSE >----------<
      return ResponseUtil.controllerResponse(
        res,
        new HttpStatus(HttpStatusCode.NO_CONTENT),
        null,
        [],
        null,
        null,
        false,
      );
    } catch (error) {
      return next(error);
    }
  }
}
