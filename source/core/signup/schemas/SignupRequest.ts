import { AccountType } from "../../../app/enums/AccountType";
import type { IRequest } from "../../../app/interfaces/IRequest";
import type { ClientError } from "../../../app/schemas/ClientError";
import { DeviceNameValidator } from "../../../common/validators/DeviceNameValidator";
import { PasswordValidator } from "../../../common/validators/PasswordValidator";
import { SessionKeyValidator } from "../../../common/validators/SessionKeyValidator";
import { UsernameValidator } from "../../../common/validators/UsernameValidator";

export class SignupRequest implements IRequest {
  public constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly accountType: AccountType,
    public readonly deviceName: string,
    public readonly sessionKey: string,
  ) {}

  public static isBlueprint(obj: unknown): obj is SignupRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as SignupRequest;
    return (
      typeof blueprint.username === "string" &&
      typeof blueprint.password === "string" &&
      Object.values(AccountType).includes(blueprint.accountType) &&
      typeof blueprint.deviceName === "string" &&
      typeof blueprint.sessionKey === "string"
    );
  }

  public static getValidationErrors(blueprintData: SignupRequest): ClientError[] {
    const validationErrors = new Array<ClientError>();
    UsernameValidator.validate(blueprintData.username, validationErrors);
    PasswordValidator.validate(blueprintData.password, validationErrors);
    DeviceNameValidator.validate(blueprintData.deviceName, validationErrors);
    SessionKeyValidator.validate(blueprintData.sessionKey, validationErrors);
    return validationErrors;
  }
}
