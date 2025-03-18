import type { IParams } from "../../../app/interfaces/IParams";
import type { ClientError } from "../../../app/schemas/ClientError";
import { PhoneValidator } from "../../../common/validators/PhoneValidator";

export class VerifyParams implements IParams {
  private constructor(public phone: string) {}

  public static isBlueprint(data: unknown): data is VerifyParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as VerifyParams;
    return typeof blueprint.phone === "string";
  }

  public static getValidationErrors(blueprintData: VerifyParams): ClientError[] {
    const validationErrors = new Array<ClientError>();
    PhoneValidator.validate(blueprintData.phone, validationErrors);
    return validationErrors;
  }
}
