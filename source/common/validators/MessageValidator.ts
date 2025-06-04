import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { MessageRules } from "../rules/MessageRules";

export class MessageValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        MessageRules.CONTENT_MIN_LENGTH,
        MessageRules.CONTENT_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_MESSAGE_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, MessageRules.CONTENT_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_MESSAGE_CONTENT));
    }
  }
}
