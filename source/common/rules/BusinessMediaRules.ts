import type { IRules } from "../../app/interfaces/IRules";
import { MediaType } from "../enums/MediaType";

export class BusinessMediaRules implements IRules {
  public static readonly ALLOWED_TYPES = [MediaType.IMAGE, MediaType.VIDEO];
}
