import { LogHelper } from "../../../app/helpers/LogHelper";
import type { IExecutor } from "../../../app/interfaces/IExecutor";
import { FileUtil } from "../../../app/utils/FileUtil";
import { BucketModule } from "../../../modules/bucket/module";
import { PurgeProvider } from "./PurgeProvider";

export class PurgeExecutor implements IExecutor {
  public constructor(private readonly provider = new PurgeProvider()) {}

  public async execute(): Promise<void> {
    LogHelper.progress("PurgeTask is running...");
    await this.provider.deleteUnusedExpiredMedia();
    LogHelper.info("Unused expired media deleted from database.");
    const medias = await this.provider.getMedias();
    const files = await BucketModule.instance.listFiles();
    const filesToPurge = files.filter(
      (file) =>
        !medias.some(
          (media) => FileUtil.getName(media.mediaId.toString(), media.extension) === file,
        ),
    );
    for (const file of filesToPurge) {
      await BucketModule.instance.deleteFile(file);
    }
    LogHelper.info("Unused expired media deleted from bucket.");
    LogHelper.success("PurgeTask is completed.");
  }
}
