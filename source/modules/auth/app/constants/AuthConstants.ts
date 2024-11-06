import type { IConstants } from "../../../../app/interfaces/IConstants";

export class AuthConstants implements IConstants {
  public static readonly ACCESS_TOKEN_EXPIRATION_TIME: string = "15m";
  public static readonly REFRESH_TOKEN_EXPIRATION_TIME: string = "30d";
}
