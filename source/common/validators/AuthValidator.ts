import { AuthConstants } from "../../app/constants/AuthConstants";
import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";

export class AuthValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (!data.startsWith(AuthConstants.TOKEN_PREFIX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_AUTHORIZATION_HEADER));
    }
    const token: unknown = data.split(" ")[1];
    if (typeof token !== "string") {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_AUTHORIZATION_HEADER));
    }
  }
}
