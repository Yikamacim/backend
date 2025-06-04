import type { IRules } from "../../app/interfaces/IRules";

export class OrderRules implements IRules {
  public static readonly NOTE_MIN_LENGTH = 1;
  public static readonly NOTE_MAX_LENGTH = 2048;
  public static readonly NOTE_REGEX = /^\P{C}*$/u;

  public static readonly PRICE_MIN = 0;
  public static readonly PRICE_MAX = Number.MAX_SAFE_INTEGER;
}
