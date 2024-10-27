import type { IValidator } from "../interfaces/IValidator.ts";
import { SessionRules } from "../rules/SessionRules.ts";
import { ClientError, ClientErrorCode } from "../schemas/ClientError.ts";
import { StringUtil } from "../utils/StringUtil.ts";

export class DeviceNameValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        SessionRules.DEVICE_NAME_MIN_LENGTH,
        SessionRules.DEVICE_NAME_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_DEVICE_NAME_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, SessionRules.DEVICE_NAME_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_DEVICE_NAME_CONTENT));
    }
  }
}
