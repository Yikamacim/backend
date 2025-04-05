import type { IUtil } from "../interfaces/IUtil";

export class ArrayUtil implements IUtil {
  public static hasDuplicates<T>(array: T[]): boolean {
    const set = new Set(array);
    if (set.size !== array.length) {
      return true;
    }
    return false;
  }
}
