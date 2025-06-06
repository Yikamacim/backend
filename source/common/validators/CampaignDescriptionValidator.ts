import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { CampaignRules } from "../rules/CampaignRules";

export class CampaignDescriptionValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        CampaignRules.DESCRIPTION_MIN_LENGTH,
        CampaignRules.DESCRIPTION_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CAMPAIGN_DESCRIPTION_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, CampaignRules.DESCRIPTION_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CAMPAIGN_DESCRIPTION_CONTENT));
    }
  }
}
