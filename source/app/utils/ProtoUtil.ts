import type { IUtil } from "../interfaces/IUtil.ts";

export class ProtoUtil implements IUtil {
  public static isProtovalid(obj: unknown): boolean {
    if (!obj) return false;
    return true;
  }
}
