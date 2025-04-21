import type { IRules } from "../../app/interfaces/IRules";

export class ItemRules implements IRules {
  public static readonly NAME_MIN_LENGTH = 1;
  public static readonly NAME_MAX_LENGTH = 64;
  public static readonly NAME_REGEX = /^\P{C}*$/u;

  public static readonly DESCRIPTION_MIN_LENGTH = 0;
  public static readonly DESCRIPTION_MAX_LENGTH = 256;
  public static readonly DESCRIPTION_REGEX = /^\P{C}*$/u;
}
