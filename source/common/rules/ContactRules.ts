import type { IRules } from "../../app/interfaces/IRules";

export class ContactRules implements IRules {
  public static readonly PHONE_MIN_LENGTH = 10;
  public static readonly PHONE_MAX_LENGTH = 15;
  public static readonly PHONE_REGEX = /^\+[1-9]\d{1,14}$/u;

  public static readonly EMAIL_MIN_LENGTH = 5;
  public static readonly EMAIL_MAX_LENGTH = 256;
  public static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u;
}
