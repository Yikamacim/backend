import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { AccountRules } from "../rules/AccountRules";

export class PhoneValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        AccountRules.PHONE_MIN_LENGTH,
        AccountRules.PHONE_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_PHONE_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, AccountRules.PHONE_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_PHONE_CONTENT));
    }
  }
}
