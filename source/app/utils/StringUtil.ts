import type { IUtil } from "../interfaces/IUtil";

export class StringUtil implements IUtil {
  public static isInLengthRange(str: string, minLength: number, maxLength: number): boolean {
    return str.length >= minLength && str.length <= maxLength;
  }

  public static matchesRegex(str: string, regex: RegExp): boolean {
    return regex.test(str);
  }

  public static canBeParsedToInt(str: string): boolean {
    return !Number.isNaN(parseInt(str));
  }
}
