import type { IRules } from "../../app/interfaces/IRules";

export class CardRules implements IRules {
  public static readonly NAME_MIN_LENGTH = 1;
  public static readonly NAME_MAX_LENGTH = 32;
  public static readonly NAME_REGEX = /^[\p{L}\s\p{N}]+$/u;

  public static readonly OWNER_MIN_LENGTH = 1;
  public static readonly OWNER_MAX_LENGTH = 128;
  public static readonly OWNER_REGEX = /^\P{C}+$/u;

  public static readonly NUMBER_LENGTH = 16;
  public static readonly NUMBER_REGEX = /^[0-9]*$/;

  public static readonly EXPIRATION_MONTH_MIN = 1;
  public static readonly EXPIRATION_MONTH_MAX = 12;

  public static readonly EXPIRATION_YEAR_MIN = new Date().getFullYear();
  public static readonly EXPIRATION_YEAR_MAX = new Date().getFullYear() + 10;

  public static readonly CVV_LENGTH = 3;
  public static readonly CVV_REGEX = /^[0-9]*$/;
}
