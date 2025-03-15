import type { IRequest } from "../../../app/interfaces/IRequest";
import type { ClientError } from "../../../app/schemas/ClientError";
import { DeviceNameValidator } from "../../../common/validators/DeviceNameValidator";
import { PasswordValidator } from "../../../common/validators/PasswordValidator";
import { PhoneValidator } from "../../../common/validators/PhoneValidator";
import { SessionKeyValidator } from "../../../common/validators/SessionKeyValidator";

export class LoginRequest implements IRequest {
  public constructor(
    public readonly phone: string,
    public readonly password: string,
    public readonly deviceName: string,
    public readonly sessionKey: string,
  ) {}

  public static isBlueprint(obj: unknown): obj is LoginRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as LoginRequest;
    return (
      typeof blueprint.phone === "string" &&
      typeof blueprint.password === "string" &&
      typeof blueprint.deviceName === "string" &&
      typeof blueprint.sessionKey === "string"
    );
  }

  public static getValidationErrors(blueprintData: LoginRequest): ClientError[] {
    const validationErrors = new Array<ClientError>();
    PhoneValidator.validate(blueprintData.phone, validationErrors);
    PasswordValidator.validate(blueprintData.password, validationErrors);
    DeviceNameValidator.validate(blueprintData.deviceName, validationErrors);
    SessionKeyValidator.validate(blueprintData.sessionKey, validationErrors);
    return validationErrors;
  }
}
