import type { IValidator } from "../interfaces/IValidator";
import { AccountRules } from "../rules/AccountRules";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { StringUtil } from "../utils/StringUtil";

export class PasswordValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        AccountRules.PASSWORD_MIN_LENGTH,
        AccountRules.PASSWORD_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_PASSWORD_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, AccountRules.PASSWORD_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_PASSWORD_CONTENT));
    }
  }
}
