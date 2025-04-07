import type { IUtil } from "../interfaces/IUtil";

export class FileUtil implements IUtil {
  public static getName(baseName: string, extension: string): string {
    return `${baseName}.${extension}`;
  }
}
