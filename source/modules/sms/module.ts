import type { IModule } from "../../app/interfaces/IModule";
import { SmsHandler } from "./core/SmsHandler";

export class SmsModule implements IModule {
  private static sInstance: SmsModule;

  public static get instance(): SmsModule {
    if (!SmsModule.sInstance) {
      SmsModule.sInstance = new SmsModule();
    }
    return SmsModule.sInstance;
  }

  private constructor(private readonly handler = new SmsHandler()) {
    this.send = this.handler.send.bind(this.handler);
  }

  public send: typeof this.handler.send;
}
