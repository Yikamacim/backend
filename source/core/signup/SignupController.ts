import type { ControllerResponse } from "../../@types/responses";
import type { Tokens } from "../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AuthModule } from "../../modules/auth/module";
import { SignupManager } from "./SignupManager";
import { SignupRequest } from "./schemas/SignupRequest";
import type { SignupResponse } from "./schemas/SignupResponse";

export class SignupController implements IController {
  public constructor(private readonly manager = new SignupManager()) {}

  public async postSignup(
    req: ExpressRequest,
    res: ControllerResponse<SignupResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const pr = SignupRequest.parse(req);
      if (pr.clientErrors.length > 0 || pr.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          pr.clientErrors,
          null,
          null,
        );
      }
      // >-----------< LOGIC >-----------<
      const mr = await this.manager.postSignup(pr.validatedData);
      // >-----------< RESPONSE >-----------<
      if (!mr.httpStatus.isSuccess() || mr.data === null) {
        return ResponseUtil.controllerResponse(
          res,
          mr.httpStatus,
          mr.serverError,
          mr.clientErrors,
          mr.data,
          null,
        );
      }
      return ResponseUtil.controllerResponse(
        res,
        mr.httpStatus,
        mr.serverError,
        mr.clientErrors,
        mr.data,
        mr.data.isVerified
          ? await AuthModule.instance.generate({
              accountId: mr.data.accountId,
              accountType: mr.data.accountType,
              deviceName: pr.validatedData.deviceName,
              sessionKey: pr.validatedData.sessionKey,
            })
          : null,
      );
    } catch (error) {
      return next(error);
    }
  }
}
