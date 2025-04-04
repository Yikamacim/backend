import type { IModule } from "../../app/interfaces/IModule";
import { BucketHandler } from "./core/BucketHandler";

export class BucketModule implements IModule {
  private static sInstance: BucketModule;

  public static get instance(): BucketModule {
    if (!BucketModule.sInstance) {
      BucketModule.sInstance = new BucketModule();
    }
    return BucketModule.sInstance;
  }

  private constructor(private readonly handler = new BucketHandler()) {
    this.getUploadUrl = this.handler.getUploadUrl.bind(this.handler);
  }

  public getUploadUrl: typeof this.handler.getUploadUrl;
}
