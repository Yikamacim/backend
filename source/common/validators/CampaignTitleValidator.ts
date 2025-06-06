import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { CampaignRules } from "../rules/CampaignRules";

export class CampaignTitleValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        CampaignRules.TITLE_MIN_LENGTH,
        CampaignRules.TITLE_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CAMPAIGN_TITLE_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, CampaignRules.TITLE_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CAMPAIGN_TITLE_CONTENT));
    }
  }
}
