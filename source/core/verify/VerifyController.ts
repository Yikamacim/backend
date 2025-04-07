import type { ControllerResponse } from "../../@types/responses";
import type { Tokens } from "../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AuthModule } from "../../modules/auth/module";
import { SmsModule } from "../../modules/sms/module";
import { VerifyManager } from "./VerifyManager";
import { VerifyParams } from "./schemas/VerifyParams";
import { VerifyRequest } from "./schemas/VerifyRequest";
import type { VerifyResponse } from "./schemas/VerifyResponse";

export class VerifyController implements IController {
  public constructor(private readonly manager = new VerifyManager()) {}

  public async postVerify(
    req: ExpressRequest,
    res: ControllerResponse<VerifyResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const request = VerifyRequest.parse(req);
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
      // >----------< LOGIC >----------<
      const out = await this.manager.postVerify(request.data);
      // >----------< RESPONSE >----------<
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
        await AuthModule.instance.generate({
          accountId: out.data.accountId,
          accountType: out.data.accountType,
          deviceName: request.data.deviceName,
          sessionKey: request.data.sessionKey,
        }),
      );
    } catch (error) {
      return next(error);
    }
  }

  public async getVerify$(
    req: ExpressRequest,
    res: ControllerResponse<null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const params = VerifyParams.parse(req);
      if (params.clientErrors.length > 0 || params.data === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          params.clientErrors,
          null,
          null,
        );
      }
      // >----------< LOGIC >----------<
      const out = await this.manager.getVerify$(params.data);
      if (out.httpStatus.isSuccess()) {
        await SmsModule.instance.send(params.data.phone);
      }
      // >----------< RESPONSE >----------<
      return ResponseUtil.controllerResponse(
        res,
        out.httpStatus,
        out.serverError,
        out.clientErrors,
        out.data,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }
}
