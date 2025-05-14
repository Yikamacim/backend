import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { SearchRules } from "../rules/SearchRules";

export class SearchQueryValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(data, SearchRules.QUERY_MIN_LENGTH, SearchRules.QUERY_MAX_LENGTH)
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_SEARCH_QUERY_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, SearchRules.QUERY_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_SEARCH_QUERY_CONTENT));
    }
  }
}
