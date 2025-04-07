import { schedule } from "node-cron";
import type { ITask } from "../../app/interfaces/ITask";
import { PurgeConstants } from "./app/constants/PurgeConstants";
import { PurgeExecutor } from "./core/PurgeExecutor";

export class PurgeTask implements ITask {
  private static sInstance: PurgeTask;

  public static get instance(): PurgeTask {
    if (PurgeTask.sInstance === undefined) {
      PurgeTask.sInstance = new PurgeTask();
    }
    return PurgeTask.sInstance;
  }

  private constructor(private readonly purgeExecutor = new PurgeExecutor()) {}

  public start(): void {
    schedule(PurgeConstants.CRON_SCHEDULE, async () => {
      await this.purgeExecutor.execute();
    });
  }
}
