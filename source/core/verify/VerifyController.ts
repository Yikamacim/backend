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
      const pr = VerifyRequest.parse(req);
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
      // >----------< LOGIC >----------<
      const mr = await this.manager.postVerify(pr.validatedData);
      // >----------< RESPONSE >----------<
      if (!mr.httpStatus.isSuccess() || !mr.data) {
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
        await AuthModule.instance.generate({
          accountId: mr.data.accountId,
          accountType: mr.data.accountType,
          deviceName: pr.validatedData.deviceName,
          sessionKey: pr.validatedData.sessionKey,
        }),
      );
    } catch (error) {
      return next(error);
    }
  }

  public async getVerify$phone(
    req: ExpressRequest,
    res: ControllerResponse<null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const pr = VerifyParams.parse(req);
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
      // >----------< LOGIC >----------<
      const mr = await this.manager.getVerify$phone(pr.validatedData);
      if (mr.httpStatus.isSuccess()) {
        await SmsModule.instance.send(pr.validatedData.phone);
      }
      // >----------< RESPONSE >----------<
      return ResponseUtil.controllerResponse(
        res,
        mr.httpStatus,
        mr.serverError,
        mr.clientErrors,
        mr.data,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }
}
