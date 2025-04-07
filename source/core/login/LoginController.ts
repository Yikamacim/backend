import type { ControllerResponse } from "../../@types/responses";
import type { Tokens } from "../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AuthModule } from "../../modules/auth/module";
import { LoginManager } from "./LoginManager";
import { LoginRequest } from "./schemas/LoginRequest";
import type { LoginResponse } from "./schemas/LoginResponse";

export class LoginController implements IController {
  public constructor(private readonly manager = new LoginManager()) {}

  public async postLogin(
    req: ExpressRequest,
    res: ControllerResponse<LoginResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const request = LoginRequest.parse(req);
      if (request.clientErrors.length > 0 || request.data === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          request.clientErrors,
          null,
          null,
        );
      }
      // >-----------< LOGIC >-----------<
      const out = await this.manager.postLogin(request.data);
      // >-----------< RESPONSE >-----------<
      if (!out.httpStatus.isSuccess() || out.data === null) {
        return ResponseUtil.controllerResponse(
          res,
          out.httpStatus,
          out.serverError,
          out.clientErrors,
          out.data,
          null,
        );
      }
      return ResponseUtil.controllerResponse(
        res,
        out.httpStatus,
        out.serverError,
        out.clientErrors,
        out.data,
        out.data.isVerified
          ? await AuthModule.instance.generate({
              accountId: out.data.accountId,
              accountType: out.data.accountType,
              deviceName: request.data.deviceName,
              sessionKey: request.data.sessionKey,
            })
          : null,
      );
    } catch (error) {
      return next(error);
    }
  }
}
