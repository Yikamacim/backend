import type { IRules } from "../../app/interfaces/IRules";

export class ServiceRules implements IRules {
  public static readonly TITLE_MIN_LENGTH = 1;
  public static readonly TITLE_MAX_LENGTH = 128;
  public static readonly TITLE_REGEX = /^\P{C}*$/u;

  public static readonly DESCRIPTION_MIN_LENGTH = 1;
  public static readonly DESCRIPTION_MAX_LENGTH = 1024;
  public static readonly DESCRIPTION_REGEX = /^\P{C}*$/u;

  public static readonly UNIT_PRICE_MIN = 0;
  public static readonly UNIT_PRICE_MAX = Number.MAX_SAFE_INTEGER;
}
