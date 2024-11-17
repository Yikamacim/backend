import type { ControllerResponse } from "../../../@types/responses";
import type { Tokens } from "../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import { PayloadHelper } from "../../../app/helpers/PayloadHelper";
import type { IController } from "../../../app/interfaces/IController";
import { UnexpectedAuthError } from "../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { AuthModule } from "../../../modules/auth/module";
import { MySessionsManager } from "./MySessionsManager";
import type { MySessionsResponse } from "./schemas/MySessionsResponse";

export class MySessionsController implements IController {
  public constructor(private readonly manager = new MySessionsManager()) {}

  public async getMySessions(
    _: ExpressRequest,
    res: ControllerResponse<MySessionsResponse[], null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<MySessionsResponse[], null> | void> {
    try {
      const local: unknown = res.locals["tokenPayload"];
      if (!PayloadHelper.isValidPayload(local)) {
        throw new UnexpectedAuthError();
      }
      const tokenPayload = local;
      // >----------< HAND OVER TO MANAGER >----------<
      const mrGetAccount = await this.manager.getMySessions(
        tokenPayload.accountId,
        tokenPayload.sessionId,
      );
      // Successful response
      return ResponseUtil.controllerResponse(
        res,
        mrGetAccount.httpStatus,
        mrGetAccount.serverError,
        mrGetAccount.clientErrors,
        mrGetAccount.data,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async deleteMySessions(
    _: ExpressRequest,
    res: ControllerResponse<null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<null, Tokens | null> | void> {
    try {
      const local: unknown = res.locals["tokenPayload"];
      if (!PayloadHelper.isValidPayload(local)) {
        throw new UnexpectedAuthError();
      }
      const tokenPayload = local;
      // >----------< HAND OVER TO MANAGER >----------<
      const mrDeleteMySessions = await this.manager.deleteMySessions(
        tokenPayload.accountId,
        tokenPayload.sessionId,
      );
      // Check manager response
      if (!mrDeleteMySessions.httpStatus.isSuccess()) {
        // Respond without token
        return ResponseUtil.controllerResponse(
          res,
          mrDeleteMySessions.httpStatus,
          mrDeleteMySessions.serverError,
          mrDeleteMySessions.clientErrors,
          mrDeleteMySessions.data,
          null,
        );
      }
      // Respond with token
      return ResponseUtil.controllerResponse(
        res,
        mrDeleteMySessions.httpStatus,
        mrDeleteMySessions.serverError,
        mrDeleteMySessions.clientErrors,
        mrDeleteMySessions.data,
        await AuthModule.instance.refresh(tokenPayload),
      );
    } catch (error) {
      return next(error);
    }
  }
}
