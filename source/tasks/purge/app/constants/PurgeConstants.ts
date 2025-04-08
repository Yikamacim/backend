import type { IConstants } from "../../../../app/interfaces/IConstants";

export class PurgeConstants implements IConstants {
  public static readonly CRON_SCHEDULE = "0 6 * * *"; // Every day at 6 AM
  public static readonly UNUSED_MEDIA_EXPIRATION_TIME = 6; // 6 hours
}
