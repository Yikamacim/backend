import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { NumberUtil } from "../../app/utils/NumberUtil";
import { CardRules } from "../rules/CardRules";

export class CardExpirationMonthValidator implements IValidator {
  public static validate(data: number, validationErrors: ClientError[]): void {
    if (
      !NumberUtil.isInRange(data, CardRules.EXPIRATION_MONTH_MIN, CardRules.EXPIRATION_MONTH_MAX)
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CARD_EXPIRATION_MONTH_CONTENT));
    }
  }
}
