import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { ReviewRules } from "../rules/ReviewRules";

export class ReviewCommentValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        ReviewRules.COMMENT_MIN_LENGTH,
        ReviewRules.COMMENT_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_REVIEW_COMMENT_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, ReviewRules.COMMENT_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_REVIEW_COMMENT_CONTENT));
    }
  }
}
