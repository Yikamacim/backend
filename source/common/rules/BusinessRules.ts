import type { IRules } from "../../app/interfaces/IRules";

export class BusinessRules implements IRules {
  public static readonly NAME_MIN_LENGTH = 1;
  public static readonly NAME_MAX_LENGTH = 128;
  public static readonly NAME_REGEX = /^[\p{L}\s\d]+$/u;

  public static readonly DESCRIPTION_MIN_LENGTH = 1;
  public static readonly DESCRIPTION_MAX_LENGTH = 1024;
  public static readonly DESCRIPTION_REGEX = /^\P{C}+$/u;
}
