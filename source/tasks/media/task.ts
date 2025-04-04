import { schedule } from "node-cron";
import type { ITask } from "../../app/interfaces/ITask";
import { MediaTaskConstants } from "./app/constants/MediaTaskConstants";
import { MediaWorker } from "./core/MediaWorker";

export class MediaTask implements ITask {
  private static sInstance: MediaTask;

  public static get instance(): MediaTask {
    if (!MediaTask.sInstance) {
      MediaTask.sInstance = new MediaTask();
    }
    return MediaTask.sInstance;
  }

  private constructor(private readonly worker = new MediaWorker()) {
    schedule(MediaTaskConstants.MEDIA_TASK_CRON, () => {
      this.worker.run();
    });
  }
}
