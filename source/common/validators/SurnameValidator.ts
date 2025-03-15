import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { AccountRules } from "../rules/AccountRules";

export class SurnameValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        AccountRules.SURNAME_MIN_LENGTH,
        AccountRules.SURNAME_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_SURNAME_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, AccountRules.SURNAME_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_SURNAME_CONTENT));
    }
  }
}
