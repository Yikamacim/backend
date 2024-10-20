import type { ControllerResponse, ManagerResponse } from "../../@types/responses.d.ts";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.d.ts";
import type { IController } from "../../app/interfaces/IController.ts";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError.ts";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.ts";
import { ProtoUtil } from "../../app/utils/ProtoUtil.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";
import { AccountsManager } from "./AccountsManager.ts";
import { AccountsRequest } from "./schemas/AccountsRequest.ts";
import type { AccountsResponse } from "./schemas/AccountsResponse.ts";

export class AccountsController implements IController {
  private readonly mManager: AccountsManager;

  constructor() {
    this.mManager = new AccountsManager();
  }

  public async getAccount(
    req: ExpressRequest,
    res: ControllerResponse<AccountsResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<AccountsResponse | null, null> | void> {
    try {
      const preliminaryData: unknown = req.params["username"];
      // V1: Existence validation
      if (ProtoUtil.isProtovalid(preliminaryData)) {
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
      if (!AccountsRequest.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
          null,
          null,
        );
      }
      const blueprintData: AccountsRequest = protovalidData;
      // V3: Physical validation
      const validationErrors: ClientError[] = AccountsRequest.getValidationErrors(blueprintData);
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
      const validatedData: AccountsRequest = blueprintData;
      // HAND OVER TO MANAGER
      const managerResponse: ManagerResponse<AccountsResponse | null> = await this.mManager
        .getAccount(validatedData);
      // Check manager response
      if (!managerResponse.httpStatus.isSuccess() || !managerResponse.data) {
        // Unsuccessful response
        return ResponseUtil.controllerResponse(
          res,
          managerResponse.httpStatus,
          managerResponse.serverError,
          managerResponse.clientErrors,
          null,
          null,
        );
      }
      // Successful response
      return ResponseUtil.controllerResponse(
        res,
        managerResponse.httpStatus,
        managerResponse.serverError,
        managerResponse.clientErrors,
        managerResponse.data,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }
}
