import type { IConstants } from "../interfaces/IConstants.ts";

export class ConfigConstants implements IConstants {
  public static readonly API_PREFIX: string = "/api";
  public static readonly PORT: number = 3000;
}
