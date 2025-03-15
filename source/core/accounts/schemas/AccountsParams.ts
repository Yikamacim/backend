import type { IParams } from "../../../app/interfaces/IParams";
import type { ClientError } from "../../../app/schemas/ClientError";
import { PhoneValidator } from "../../../common/validators/PhoneValidator";

export class AccountsParams implements IParams {
  private constructor(public readonly phone: string) {}

  public static isBlueprint(data: unknown): data is AccountsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as AccountsParams;
    return typeof blueprint.phone === "string";
  }

  public static getValidationErrors(blueprintData: AccountsParams): ClientError[] {
    const validationErrors = new Array<ClientError>();
    PhoneValidator.validate(blueprintData.phone, validationErrors);
    return validationErrors;
  }
}
