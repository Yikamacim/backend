import type { ControllerResponse } from "../../@types/responses";
import type { Tokens } from "../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { LoginManager } from "./LoginManager";
import { VerifyRequest } from "./schemas/VerifyRequest";
import type { VerifyResponse } from "./schemas/VerifyResponse";

export class VerifyController implements IController {
  public constructor(private readonly manager = new LoginManager()) {}

  public async postVerify(
    req: ExpressRequest,
    res: ControllerResponse<VerifyResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< REQUEST VALIDATION >----------<
      const preliminaryData: unknown = req.body;
      // V1: Existence validation
      if (!ProtoUtil.isProtovalid(preliminaryData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.MISSING_BODY)],
          null,
          null,
        );
      }
      const protovalidData: unknown = preliminaryData;
      // V2: Schematic validation
      if (!VerifyRequest.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_BODY)],
          null,
          null,
        );
      }
      const blueprintData: VerifyRequest = protovalidData;
      // V3: Physical validation
      const validationErrors: ClientError[] = VerifyRequest.getValidationErrors(blueprintData);
      if (validationErrors.length > 0) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          validationErrors,
          null,
          null,
        );
      }
      const validatedData = blueprintData;
      // >-----------< HAND OVER TO MANAGER >-----------<
      const mrPostLogin = await this.manager.postLogin(validatedData);
      // Check manager response
      if (!mrPostLogin.httpStatus.isSuccess() || !mrPostLogin.data) {
        // Respond without token
        return ResponseUtil.controllerResponse(
          res,
          mrPostLogin.httpStatus,
          mrPostLogin.serverError,
          mrPostLogin.clientErrors,
          mrPostLogin.data,
          null,
        );
      }
      // // Respond with or without token
      // return ResponseUtil.controllerResponse(
      //   res,
      //   mrPostLogin.httpStatus,
      //   mrPostLogin.serverError,
      //   mrPostLogin.clientErrors,
      //   mrPostLogin.data,
      //   mrPostLogin.data.isVerified
      //     ? await AuthModule.instance.generate({
      //         accountId: mrPostLogin.data.accountId,
      //         accountType: mrPostLogin.data.accountType,
      //         deviceName: validatedData.deviceName,
      //         sessionKey: validatedData.sessionKey,
      //       })
      //     : null,
      // );
    } catch (error) {
      return next(error);
    }
  }
}
