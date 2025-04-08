import type { ControllerResponse } from "../../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { PurgeTask } from "../../../tasks/purge/task";

export class PurgeController implements IController {
  public async deletePurge(
    _: ExpressRequest,
    res: ControllerResponse<null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< LOGIC >----------<
      await PurgeTask.instance.run();
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
