import type { IConstants } from "../../../../app/interfaces/IConstants";

export class BucketConstants implements IConstants {
  public static readonly ACCESS_URL_EXPIRATION_TIME = 1800; // 30 minutes
  public static readonly UPLOAD_URL_EXPIRATION_TIME = 3600; // 1 hour
}
