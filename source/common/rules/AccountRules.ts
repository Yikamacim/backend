import type { IRules } from "../../app/interfaces/IRules";

export class AccountRules implements IRules {
  public static readonly NAME_MIN_LENGTH = 1;
  public static readonly NAME_MAX_LENGTH = 64;
  public static readonly NAME_REGEX = /^[\p{L}\s]+$/u;

  public static readonly SURNAME_MIN_LENGTH = 1;
  public static readonly SURNAME_MAX_LENGTH = 64;
  public static readonly SURNAME_REGEX = /^[\p{L}]+$/u;

  public static readonly PASSWORD_MIN_LENGTH = 4;
  public static readonly PASSWORD_MAX_LENGTH = Number.MAX_SAFE_INTEGER;
  public static readonly PASSWORD_REGEX =
    /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\p{N})(?=.*[^\p{L}\p{N}\s])\S+$/u;
}
