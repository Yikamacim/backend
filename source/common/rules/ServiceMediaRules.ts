import type { IRules } from "../../app/interfaces/IRules";
import { MediaType } from "../enums/MediaType";

export class ServiceMediaRules implements IRules {
  public static readonly ALLOWED_TYPES = [MediaType.IMAGE];
}
