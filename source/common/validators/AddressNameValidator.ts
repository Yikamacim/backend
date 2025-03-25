import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { AddressRules } from "../rules/AddressRules";

export class AddressNameValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(data, AddressRules.NAME_MIN_LENGTH, AddressRules.NAME_MAX_LENGTH)
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_ADDRESS_NAME_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, AddressRules.NAME_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_ADDRESS_NAME_CONTENT));
    }
  }
}
