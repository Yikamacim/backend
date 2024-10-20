import type { IRequest } from "../../../app/interfaces/IRequest.ts";
import type { ClientError } from "../../../app/schemas/ClientError.ts";
import { PasswordValidator } from "../../../app/validators/PasswordValidator.ts";
import { SessionKeyValidator } from "../../../app/validators/SessionKeyValidator.ts";
import { UsernameValidator } from "../../../app/validators/UsernameValidator.ts";

export class LoginRequest implements IRequest {
  constructor(
    public readonly sessionKey: string,
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static isBlueprint(obj: unknown): obj is LoginRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint: LoginRequest = obj as LoginRequest;
    return (
      typeof blueprint.sessionKey === "string" &&
      typeof blueprint.username === "string" &&
      typeof blueprint.password === "string"
    );
  }

  public static getValidationErrors(blueprintData: LoginRequest): ClientError[] {
    const validationErrors: ClientError[] = new Array<ClientError>();
    SessionKeyValidator.validate(blueprintData.sessionKey, validationErrors);
    UsernameValidator.validate(blueprintData.username, validationErrors);
    PasswordValidator.validate(blueprintData.password, validationErrors);
    return validationErrors;
  }
}
