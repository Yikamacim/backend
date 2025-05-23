import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { CardRules } from "../rules/CardRules";

export class CardCvvValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (data.length !== CardRules.CVV_LENGTH) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CARD_CVV_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, CardRules.CVV_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CARD_CVV_CONTENT));
    }
  }
}
