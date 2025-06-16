import type { IConstants } from "../interfaces/IConstants";

export class BusinessConstants implements IConstants {
  public static readonly ADDRESS_NAME = "Business Address";
  public static readonly ADDRESS_IS_DEFAULT = true;

  public static readonly TOP_BUSINESSES_COUNT = 10;
}
