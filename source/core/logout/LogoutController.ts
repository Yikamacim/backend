import type { ControllerResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { PayloadHelper } from "../../app/helpers/PayloadHelper";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { UnexpectedAuthError } from "../../app/schemas/ServerError";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AuthModule } from "../../modules/auth/module";

export class LogoutController implements IController {
  public async postLogin(
    _: ExpressRequest,
    res: ControllerResponse<null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION VALIDATION >-----------<
      const local: unknown = res.locals["tokenPayload"];
      // V0: Authorization validation
      if (!PayloadHelper.isValidPayload(local)) {
        throw new UnexpectedAuthError();
      }
      const tokenPayload = local;
      // Revoke the session
      await AuthModule.instance.revoke(tokenPayload);
      // Respond with or without token
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
