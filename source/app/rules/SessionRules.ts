import type { IRules } from "../interfaces/IRules.ts";

export class SessionRules implements IRules {
  public static readonly SESSION_KEY_MIN_LENGTH: number = 96;
  public static readonly SESSION_KEY_MAX_LENGTH: number = 128;
  public static readonly SESSION_KEY_REGEX: RegExp = /^[^.]+\.[^.]+$/;
}
