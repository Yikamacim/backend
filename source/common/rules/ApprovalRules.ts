import type { IRules } from "../../app/interfaces/IRules";

export class ApprovalRules implements IRules {
  public static readonly MESSAGE_MIN_LENGTH = 0;
  public static readonly MESSAGE_MAX_LENGTH = 4096;
  public static readonly MESSAGE_REGEX = /^.*$/;

  public static readonly REASON_MIN_LENGTH = 0;
  public static readonly REASON_MAX_LENGTH = 4096;
  public static readonly REASON_REGEX = /^.*$/;
}
