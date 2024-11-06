import type { IValidator } from "../interfaces/IValidator";
import { AccountRules } from "../rules/AccountRules";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { StringUtil } from "../utils/StringUtil";

export class UsernameValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        AccountRules.USERNAME_MIN_LENGTH,
        AccountRules.USERNAME_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_USERNAME_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, AccountRules.USERNAME_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_USERNAME_CONTENT));
    }
  }
}
