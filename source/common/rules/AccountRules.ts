import type { IRules } from "../../app/interfaces/IRules";

export class AccountRules implements IRules {
  public static readonly USERNAME_MIN_LENGTH = 2;
  public static readonly USERNAME_MAX_LENGTH = 16;
  public static readonly USERNAME_REGEX = /^(?!.*[ ]{2,})[\p{L}\p{N}][\p{L}\p{N} ]*[\p{L}\p{N}]$/u;

  public static readonly PASSWORD_MIN_LENGTH = 4;
  public static readonly PASSWORD_MAX_LENGTH = Number.MAX_SAFE_INTEGER;
  public static readonly PASSWORD_REGEX =
    /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\p{N})(?=.*[^\p{L}\p{N}\s])\S+$/u;
}
