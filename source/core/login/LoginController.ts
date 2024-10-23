import type { ControllerResponse, ManagerResponse } from "../../@types/responses.d.ts";
import type { Tokens } from "../../@types/tokens.d.ts";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.d.ts";
import type { IController } from "../../app/interfaces/IController.ts";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError.ts";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.ts";
import { ProtoUtil } from "../../app/utils/ProtoUtil.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";
import { AuthModule } from "../../modules/auth/module.ts";
import { LoginManager } from "./LoginManager.ts";
import { LoginRequest } from "./schemas/LoginRequest.ts";
import type { LoginResponse } from "./schemas/LoginResponse.ts";

export class LoginController implements IController {
  private readonly mManager: LoginManager;

  constructor() {
    this.mManager = new LoginManager();
  }

  public async postLogin(
    req: ExpressRequest,
    res: ControllerResponse<LoginResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<LoginResponse | null, Tokens | null> | void> {
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
      if (!LoginRequest.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_BODY)],
          null,
          null,
        );
      }
      const blueprintData: LoginRequest = protovalidData;
      // V3: Physical validation
      const validationErrors: ClientError[] = LoginRequest.getValidationErrors(blueprintData);
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
      const validatedData: LoginRequest = blueprintData;
      // HAND OVER TO MANAGER
      const managerResponse: ManagerResponse<LoginResponse | null> = await this.mManager.postLogin(
        validatedData,
      );
      // Check manager response
      if (!managerResponse.httpStatus.isSuccess() || !managerResponse.data) {
        // Respond without token
        return res.status(managerResponse.httpStatus.code).send({
          httpStatus: managerResponse.httpStatus,
          serverError: managerResponse.serverError,
          clientErrors: managerResponse.clientErrors,
          data: null,
          tokens: null,
        });
      }
      // Respond with token
      return res.status(managerResponse.httpStatus.code).send({
        httpStatus: managerResponse.httpStatus,
        serverError: managerResponse.serverError,
        clientErrors: managerResponse.clientErrors,
        data: managerResponse.data,
        tokens: await AuthModule.instance
          .withData({
            accountId: managerResponse.data.accountId,
            accountType: managerResponse.data.accountType,
            sessionKey: req.body.sessionKey,
          })
          .generateTokens(),
      });
    } catch (error) {
      return next(error);
    }
  }
}
