import type { IRules } from "../interfaces/IRules";

export class SessionRules implements IRules {
  public static readonly SESSION_KEY_LENGTH: number = 64;
  public static readonly SESSION_KEY_REGEX: RegExp = /^[0-9a-f].*$/;
  public static readonly DEVICE_NAME_MIN_LENGTH: number = 1;
  public static readonly DEVICE_NAME_MAX_LENGTH: number = 256;
  public static readonly DEVICE_NAME_REGEX: RegExp = /^.*$/;
}
