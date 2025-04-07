import type { IRules } from "../../app/interfaces/IRules";

export class VehicleRules implements IRules {
  public static readonly BRAND_MIN_LENGTH = 1;
  public static readonly BRAND_MAX_LENGTH = 64;
  public static readonly BRAND_REGEX = /^\P{C}*$/u;

  public static readonly MODEL_MIN_LENGTH = 1;
  public static readonly MODEL_MAX_LENGTH = 64;
  public static readonly MODEL_REGEX = /^\P{C}*$/u;
}
