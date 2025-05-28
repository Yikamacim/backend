import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { NumberUtil } from "../../app/utils/NumberUtil";
import { OrderRules } from "../rules/OrderRules";

export class OrderPriceValidator implements IValidator {
  public static validate(data: number, validationErrors: ClientError[]): void {
    if (!NumberUtil.isInRange(data, OrderRules.PRICE_MIN, OrderRules.PRICE_MAX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_PRICE_CONTENT));
    }
  }
}
