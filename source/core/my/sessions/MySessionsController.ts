import type { ControllerResponse } from "../../../@types/responses";
import type { Tokens } from "../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import { PayloadHelper } from "../../../app/helpers/PayloadHelper";
import type { IController } from "../../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { UnexpectedAuthError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { AuthModule } from "../../../modules/auth/module";
import { MySessionsManager } from "./MySessionsManager";
import { MySessionsParams } from "./schemas/MySessionsParams";
import type { MySessionsResponse } from "./schemas/MySessionsResponse";

export class MySessionsController implements IController {
  public constructor(private readonly manager = new MySessionsManager()) {}

  public async getMySessions(
    _: ExpressRequest,
    res: ControllerResponse<MySessionsResponse[], Tokens | null>,
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
      const mrGetMySessions = await this.manager.getMySessions(
        tokenPayload.accountId,
        tokenPayload.sessionId,
      );
      // Check manager response
      if (!mrGetMySessions.httpStatus.isSuccess()) {
        // Respond without token
        return ResponseUtil.controllerResponse(
          res,
          mrGetMySessions.httpStatus,
          mrGetMySessions.serverError,
          mrGetMySessions.clientErrors,
          mrGetMySessions.data,
          null,
        );
      }
      // Respond with token
      return ResponseUtil.controllerResponse(
        res,
        mrGetMySessions.httpStatus,
        mrGetMySessions.serverError,
        mrGetMySessions.clientErrors,
        mrGetMySessions.data,
        await AuthModule.instance.refresh(tokenPayload),
      );
    } catch (error) {
      return next(error);
    }
  }

  public async deleteMySessions$sessionId(
    req: ExpressRequest,
    res: ControllerResponse<null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<null, Tokens | null> | void> {
    try {
      // >-----------< AUTHORIZATION VALIDATION >-----------<
      const local: unknown = res.locals["tokenPayload"];
      if (!PayloadHelper.isValidPayload(local)) {
        throw new UnexpectedAuthError();
      }
      const tokenPayload = local;
      // >----------< REQUEST VALIDATION >----------<
      const preliminaryData: unknown = req.params["sessionId"];
      // V1: Existence validation
      if (!ProtoUtil.isProtovalid(preliminaryData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
          null,
          null,
        );
      }
      const protovalidData: unknown = { sessionId: preliminaryData };
      // V2: Schematic validation
      if (!MySessionsParams.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
          null,
          null,
        );
      }
      const blueprintData: MySessionsParams = protovalidData;
      // V3: Physical validation
      const validationErrors = MySessionsParams.getValidationErrors(blueprintData);
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
      // >----------< HAND OVER TO MANAGER >----------<
      const mrDeleteMySessions$sessionId = await this.manager.deleteMySessions$sessionId(
        tokenPayload.accountId,
        tokenPayload.sessionId,
        parseInt(validatedData.sessionId),
      );
      // Check manager response
      if (!mrDeleteMySessions$sessionId.httpStatus.isSuccess()) {
        // Respond without token
        return ResponseUtil.controllerResponse(
          res,
          mrDeleteMySessions$sessionId.httpStatus,
          mrDeleteMySessions$sessionId.serverError,
          mrDeleteMySessions$sessionId.clientErrors,
          mrDeleteMySessions$sessionId.data,
          null,
        );
      }
      // Respond with token
      return ResponseUtil.controllerResponse(
        res,
        mrDeleteMySessions$sessionId.httpStatus,
        mrDeleteMySessions$sessionId.serverError,
        mrDeleteMySessions$sessionId.clientErrors,
        mrDeleteMySessions$sessionId.data,
        await AuthModule.instance.refresh(tokenPayload),
      );
    } catch (error) {
      return next(error);
    }
  }
}
