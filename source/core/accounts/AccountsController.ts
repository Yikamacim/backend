import type { ControllerResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AccountsManager } from "./AccountsManager";
import { AccountsParams } from "./schemas/AccountsParams";
import type { AccountsResponse } from "./schemas/AccountsResponse";

export class AccountsController implements IController {
  public constructor(private readonly manager = new AccountsManager()) {}

  public async getAccount(
    req: ExpressRequest,
    res: ControllerResponse<AccountsResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const pr = AccountsParams.parse(req);
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
      const mr = await this.manager.getAccount(pr.validatedData);
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
