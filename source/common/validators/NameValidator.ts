import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { AccountRules } from "../rules/AccountRules";

export class NameValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(data, AccountRules.NAME_MIN_LENGTH, AccountRules.NAME_MAX_LENGTH)
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_NAME_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, AccountRules.NAME_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_NAME_CONTENT));
    }
  }
}
