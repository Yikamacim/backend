import type { IModule } from "../../app/interfaces/IModule";
import { BucketHandler } from "./core/BucketHandler";

export class BucketModule implements IModule {
  private static sInstance: BucketModule;

  public static get instance(): BucketModule {
    if (BucketModule.sInstance === undefined) {
      BucketModule.sInstance = new BucketModule();
    }
    return BucketModule.sInstance;
  }

  private constructor(private readonly handler = new BucketHandler()) {
    this.getAccessUrl = this.handler.getAccessUrl.bind(this.handler);
    this.getUploadUrl = this.handler.getUploadUrl.bind(this.handler);
    this.listFiles = this.handler.listFiles.bind(this.handler);
    this.checkFileExists = this.handler.checkFileExists.bind(this.handler);
    this.deleteFile = this.handler.deleteFile.bind(this.handler);
  }

  public readonly getAccessUrl: typeof this.handler.getAccessUrl;
  public readonly getUploadUrl: typeof this.handler.getUploadUrl;
  public readonly listFiles: typeof this.handler.listFiles;
  public readonly checkFileExists: typeof this.handler.checkFileExists;
  public readonly deleteFile: typeof this.handler.deleteFile;
}
