import type { IUtil } from "../interfaces/IUtil";

export class ProtoUtil implements IUtil {
  public static isProtovalid(obj: unknown): boolean {
    if (obj === undefined || obj === null) {
      return false;
    }
    return true;
  }
}
