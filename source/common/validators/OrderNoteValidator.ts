import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { OrderRules } from "../rules/OrderRules";

export class OrderNoteValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (!StringUtil.isInLengthRange(data, OrderRules.NOTE_MIN_LENGTH, OrderRules.NOTE_MAX_LENGTH)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_ORDER_NOTE_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, OrderRules.NOTE_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_NAME_CONTENT));
    }
  }
}
