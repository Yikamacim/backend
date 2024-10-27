import type { ControllerResponse, ManagerResponse } from "../../@types/responses";
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
  private readonly mManager: SignupManager;

  constructor() {
    this.mManager = new SignupManager();
  }

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
      const validatedData: SignupRequest = blueprintData;
      // HAND OVER TO MANAGER
      const managerResponse: ManagerResponse<SignupResponse | null> =
        await this.mManager.postSignup(validatedData);
      // Check manager response
      if (!managerResponse.httpStatus.isSuccess() || !managerResponse.data) {
        // Respond without token
        return ResponseUtil.controllerResponse(
          res,
          managerResponse.httpStatus,
          managerResponse.serverError,
          managerResponse.clientErrors,
          managerResponse.data,
          null,
        );
      }
      // Respond with token
      return ResponseUtil.controllerResponse(
        res,
        managerResponse.httpStatus,
        managerResponse.serverError,
        managerResponse.clientErrors,
        managerResponse.data,
        await AuthModule.instance
          .withData({
            accountId: managerResponse.data.accountId,
            accountType: managerResponse.data.accountType,
            deviceName: validatedData.deviceName,
            sessionKey: validatedData.sessionKey,
          })
          .generateTokens(),
      );
    } catch (error) {
      return next(error);
    }
  }
}
