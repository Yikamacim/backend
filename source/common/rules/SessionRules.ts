import type { IRules } from "../../app/interfaces/IRules";

export class SessionRules implements IRules {
  public static readonly SESSION_KEY_LENGTH = 64;
  public static readonly SESSION_KEY_REGEX = /^[0-9a-f].*$/;

  public static readonly DEVICE_NAME_MIN_LENGTH = 1;
  public static readonly DEVICE_NAME_MAX_LENGTH = 256;
  public static readonly DEVICE_NAME_REGEX = /^\P{C}+$/u;
}
