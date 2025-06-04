import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { NumberUtil } from "../../app/utils/NumberUtil";
import { ReviewRules } from "../rules/ReviewRules";

export class ReviewStarsValidator implements IValidator {
  public static validate(data: number, validationErrors: ClientError[]): void {
    if (!NumberUtil.isInRange(data, ReviewRules.STARS_MIN, ReviewRules.STARS_MAX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_REVIEW_STARS_CONTENT));
    }
  }
}
