import type { IRules } from "../../app/interfaces/IRules";

export class ReviewRules implements IRules {
  public static readonly STARS_MIN = 1;
  public static readonly STARS_MAX = 5;

  public static readonly COMMENT_MIN_LENGTH = 1;
  public static readonly COMMENT_MAX_LENGTH = 2048;
  public static readonly COMMENT_REGEX = /^\P{C}*$/u;
}
