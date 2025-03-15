import type { ControllerResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
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
      // >----------< REQUEST VALIDATION >----------<
      const preliminaryData: unknown = req.params["phone"];
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
      const protovalidData: unknown = { username: preliminaryData };
      // V2: Schematic validation
      if (!AccountsParams.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
          null,
          null,
        );
      }
      const blueprintData: AccountsParams = protovalidData;
      // V3: Physical validation
      const validationErrors = AccountsParams.getValidationErrors(blueprintData);
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
      const mrGetAccount = await this.manager.getAccount(validatedData);
      // Check manager response
      if (!mrGetAccount.httpStatus.isSuccess()) {
        // Unsuccessful response
        return ResponseUtil.controllerResponse(
          res,
          mrGetAccount.httpStatus,
          mrGetAccount.serverError,
          mrGetAccount.clientErrors,
          null,
          null,
        );
      }
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
}
