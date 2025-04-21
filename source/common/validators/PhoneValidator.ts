import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { ContactRules } from "../rules/ContactRules";

export class PhoneValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        ContactRules.PHONE_MIN_LENGTH,
        ContactRules.PHONE_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_PHONE_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, ContactRules.PHONE_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_PHONE_CONTENT));
    }
  }
}
