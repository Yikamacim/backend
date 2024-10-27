import type { IParams } from "../../../app/interfaces/IParams.ts";
import type { ClientError } from "../../../app/schemas/ClientError.ts";
import { UsernameValidator } from "../../../app/validators/UsernameValidator.ts";

export class AccountsParams implements IParams {
  private constructor(public readonly username: string) {}

  public static isBlueprint(data: unknown): data is AccountsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint: AccountsParams = data as AccountsParams;
    return typeof blueprint.username === "string";
  }

  public static getValidationErrors(blueprintData: AccountsParams): ClientError[] {
    const validationErrors: ClientError[] = new Array<ClientError>();
    UsernameValidator.validate(blueprintData.username, validationErrors);
    return validationErrors;
  }
}
