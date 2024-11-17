import type { ControllerResponse } from "../../@types/responses";
import type { Tokens } from "../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
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
  ): Promise<ControllerResponse<SignupResponse | null, Tokens | null> | void> {
    try {
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
      if (!SignupRequest.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_BODY)],
          null,
          null,
        );
      }
      const blueprintData: SignupRequest = protovalidData;
      // V3: Physical validation
      const validationErrors: ClientError[] = SignupRequest.getValidationErrors(blueprintData);
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
      const mrPostSignup = await this.manager.postSignup(validatedData);
      // Check manager response
      if (!mrPostSignup.httpStatus.isSuccess() || !mrPostSignup.data) {
        // Respond without token
        return ResponseUtil.controllerResponse(
          res,
          mrPostSignup.httpStatus,
          mrPostSignup.serverError,
          mrPostSignup.clientErrors,
          mrPostSignup.data,
          null,
        );
      }
      // Respond with token
      return ResponseUtil.controllerResponse(
        res,
        mrPostSignup.httpStatus,
        mrPostSignup.serverError,
        mrPostSignup.clientErrors,
        mrPostSignup.data,
        await AuthModule.instance.generate({
          accountId: mrPostSignup.data.accountId,
          accountType: mrPostSignup.data.accountType,
          deviceName: validatedData.deviceName,
          sessionKey: validatedData.sessionKey,
        }),
      );
    } catch (error) {
      return next(error);
    }
  }
}
