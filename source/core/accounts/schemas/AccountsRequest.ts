import type { IRequest } from "../../../app/interfaces/IRequest.ts";
import type { ClientError } from "../../../app/schemas/ClientError.ts";
import { UsernameValidator } from "../../../app/validators/UsernameValidator.ts";

export class AccountsRequest implements IRequest {
  private constructor(public readonly username: string) {}

  public static isBlueprint(data: unknown): data is AccountsRequest {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint: AccountsRequest = data as AccountsRequest;
    return typeof blueprint.username === "string";
  }

  public static getValidationErrors(blueprintData: AccountsRequest): ClientError[] {
    const validationErrors: ClientError[] = new Array<ClientError>();
    UsernameValidator.validate(blueprintData.username, validationErrors);
    return validationErrors;
  }
}
