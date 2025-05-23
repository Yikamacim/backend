import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { NumberUtil } from "../../app/utils/NumberUtil";
import { CardRules } from "../rules/CardRules";

export class CardExpirationYearValidator implements IValidator {
  public static validate(data: number, validationErrors: ClientError[]): void {
    if (!NumberUtil.isInRange(data, CardRules.EXPIRATION_YEAR_MIN, CardRules.EXPIRATION_YEAR_MAX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CARD_EXPIRATION_YEAR_CONTENT));
    }
  }
}
