import type { IRequest } from "../../../app/interfaces/IRequest";
import type { ClientError } from "../../../app/schemas/ClientError";
import { CodeValidator } from "../../../common/validators/CodeValidator";
import { PhoneValidator } from "../../../common/validators/PhoneValidator";

export class VerifyRequest implements IRequest {
  public constructor(
    public readonly phone: string,
    public readonly code: string,
  ) {}

  public static isBlueprint(obj: unknown): obj is VerifyRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as VerifyRequest;
    return typeof blueprint.phone === "string" && typeof blueprint.code === "string";
  }

  public static getValidationErrors(blueprintData: VerifyRequest): ClientError[] {
    const validationErrors = new Array<ClientError>();
    PhoneValidator.validate(blueprintData.phone, validationErrors);
    CodeValidator.validate(blueprintData.code, validationErrors);
    return validationErrors;
  }
}
