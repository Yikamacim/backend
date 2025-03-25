import type { ControllerResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { PayloadHelper } from "../../app/helpers/PayloadHelper";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AuthModule } from "../../modules/auth/module";

export class LogoutController implements IController {
  public async postLogin(
    _: ExpressRequest,
    res: ControllerResponse<null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const tokenPayload = PayloadHelper.getPayload(res);
      // >-----------< LOGIC >-----------<
      await AuthModule.instance.revoke(tokenPayload);
      // >-----------< RESPONSE >-----------<
      return ResponseUtil.controllerResponse(
        res,
        new HttpStatus(HttpStatusCode.NO_CONTENT),
        null,
        [],
        null,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }
}
