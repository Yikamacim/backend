import type { IRules } from "../../app/interfaces/IRules";
import { EMediaType } from "../enums/EMediaType";

export class CampaignMediaRules implements IRules {
  public static readonly ALLOWED_TYPES = [EMediaType.IMAGE];
}
