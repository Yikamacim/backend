import type { IRules } from "../../app/interfaces/IRules";

export class BusinessRules implements IRules {
  public static readonly NAME_MIN_LENGTH = 1;
  public static readonly NAME_MAX_LENGTH = 128;
  public static readonly NAME_REGEX = /^[\p{L}\s\d]+$/u;

  public static readonly DESCRIPTION_MIN_LENGTH = 1;
  public static readonly DESCRIPTION_MAX_LENGTH = 1024;
  public static readonly DESCRIPTION_REGEX = /^\P{C}+$/u;

  public static readonly HOUR_LENGTH = 5;
  public static readonly HOUR_REGEX = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
}
