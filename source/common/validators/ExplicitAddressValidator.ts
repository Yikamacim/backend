import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { AddressRules } from "../rules/AddressRules";

export class ExplicitAddressValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        AddressRules.EXPLICIT_ADDRESS_MIN_LENGTH,
        AddressRules.EXPLICIT_ADDRESS_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_EXPLICIT_ADDRESS_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, AddressRules.EXPLICIT_ADDRESS_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_EXPLICIT_ADDRESS_CONTENT));
    }
  }
}
