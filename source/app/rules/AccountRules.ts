import type { IRules } from "../interfaces/IRules";

export class AccountRules implements IRules {
  public static readonly USERNAME_MIN_LENGTH: number = 2;
  public static readonly USERNAME_MAX_LENGTH: number = 16;
  public static readonly USERNAME_REGEX: RegExp =
    /^(?!.*[ ]{2,})[\p{L}\p{N}][\p{L}\p{N} ]*[\p{L}\p{N}]$/u;

  public static readonly PASSWORD_MIN_LENGTH: number = 4;
  public static readonly PASSWORD_MAX_LENGTH: number = Number.MAX_SAFE_INTEGER;
  public static readonly PASSWORD_REGEX: RegExp =
    /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\p{N})(?=.*[^\p{L}\p{N}\s])\S+$/u;
}
