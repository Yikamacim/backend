import { AccountType } from "../../../app/enums/AccountType";
import type { IRequest } from "../../../app/interfaces/IRequest";
import type { ClientError } from "../../../app/schemas/ClientError";
import { DeviceNameValidator } from "../../../common/validators/DeviceNameValidator";
import { NameValidator } from "../../../common/validators/NameValidator";
import { PasswordValidator } from "../../../common/validators/PasswordValidator";
import { PhoneValidator } from "../../../common/validators/PhoneValidator";
import { SessionKeyValidator } from "../../../common/validators/SessionKeyValidator";
import { SurnameValidator } from "../../../common/validators/SurnameValidator";

export class SignupRequest implements IRequest {
  public constructor(
    public readonly phone: string,
    public readonly password: string,
    public readonly name: string,
    public readonly surname: string,
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
      typeof blueprint.phone === "string" &&
      typeof blueprint.password === "string" &&
      typeof blueprint.name === "string" &&
      typeof blueprint.surname === "string" &&
      Object.values(AccountType).includes(blueprint.accountType) &&
      typeof blueprint.deviceName === "string" &&
      typeof blueprint.sessionKey === "string"
    );
  }

  public static getValidationErrors(blueprintData: SignupRequest): ClientError[] {
    const validationErrors = new Array<ClientError>();
    PhoneValidator.validate(blueprintData.phone, validationErrors);
    PasswordValidator.validate(blueprintData.password, validationErrors);
    NameValidator.validate(blueprintData.name, validationErrors);
    SurnameValidator.validate(blueprintData.surname, validationErrors);
    DeviceNameValidator.validate(blueprintData.deviceName, validationErrors);
    SessionKeyValidator.validate(blueprintData.sessionKey, validationErrors);
    return validationErrors;
  }
}
