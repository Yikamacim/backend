import type { IUtil } from "../interfaces/IUtil";

export class NumberUtil implements IUtil {
  public static isInRange(val: number, min: number, max: number): boolean {
    return val >= min && val <= max;
  }
}
