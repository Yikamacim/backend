import type { IParams } from "../../../app/interfaces/IParams";
import type { ClientError } from "../../../app/schemas/ClientError";
import { UsernameValidator } from "../../../common/validators/UsernameValidator";

export class AccountsParams implements IParams {
  private constructor(public readonly username: string) {}

  public static isBlueprint(data: unknown): data is AccountsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as AccountsParams;
    return typeof blueprint.username === "string";
  }

  public static getValidationErrors(blueprintData: AccountsParams): ClientError[] {
    const validationErrors = new Array<ClientError>();
    UsernameValidator.validate(blueprintData.username, validationErrors);
    return validationErrors;
  }
}
