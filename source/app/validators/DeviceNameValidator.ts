import type { IValidator } from "../interfaces/IValidator";
import { SessionRules } from "../rules/SessionRules";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { StringUtil } from "../utils/StringUtil";

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
