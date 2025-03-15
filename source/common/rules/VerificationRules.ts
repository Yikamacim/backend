import type { IRules } from "../../app/interfaces/IRules";

export class VerificationRules implements IRules {
  public static readonly CODE_LENGTH = 6;
  public static readonly CODE_REGEX = /^\d{6}$/;
}
