import type { IValidator } from "../interfaces/IValidator";
import { SessionRules } from "../rules/SessionRules";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { StringUtil } from "../utils/StringUtil";

export class SessionKeyValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (data.length !== SessionRules.SESSION_KEY_LENGTH) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_SESSION_KEY_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, SessionRules.SESSION_KEY_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_SESSION_KEY_CONTENT));
    }
  }
}
