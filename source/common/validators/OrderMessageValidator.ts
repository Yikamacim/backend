import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { OrderRules } from "../rules/OrderRules";

export class OrderMessageValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        OrderRules.MESSAGE_MIN_LENGTH,
        OrderRules.MESSAGE_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_APPROVAL_MESSAGE_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, OrderRules.MESSAGE_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_ORDER_MESSAGE_CONTENT));
    }
  }
}
