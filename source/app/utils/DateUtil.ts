import type { IUtil } from "../interfaces/IUtil";

export class DateUtil implements IUtil {
  public static isExpired(time: Date, secondsToExpire: number): boolean {
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    return diff > secondsToExpire * 1000;
  }
}
