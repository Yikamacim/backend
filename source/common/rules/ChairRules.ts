import type { IRules } from "../../app/interfaces/IRules";

export class ChairRules implements IRules {
  public static readonly QUANTITY_MIN = 1;
  public static readonly QUANTITY_MAX = Number.MAX_SAFE_INTEGER;
}
