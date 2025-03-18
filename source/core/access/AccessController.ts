import type { ControllerResponse } from "../../@types/responses";
import type { Tokens } from "../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { PayloadHelper } from "../../app/helpers/PayloadHelper";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { UnexpectedAuthError } from "../../app/schemas/ServerError";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AuthModule } from "../../modules/auth/module";

export class AccessController implements IController {
  public async getAccess(
    _: ExpressRequest,
    res: ControllerResponse<null, Tokens | null>,
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
      // >----------< HAND OVER TO MANAGER >----------<
      // Respond with token
      return ResponseUtil.controllerResponse(
        res,
        new HttpStatus(HttpStatusCode.OK),
        null,
        [],
        null,
        await AuthModule.instance.refresh(tokenPayload),
      );
    } catch (error) {
      return next(error);
    }
  }
}
