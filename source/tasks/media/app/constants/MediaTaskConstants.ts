import type { IConstants } from "../../../../app/interfaces/IConstants";

export class MediaTaskConstants implements IConstants {
  public static readonly MEDIA_TASK_CRON = "0 5 * * *"; // Every day at 5 AM
}
