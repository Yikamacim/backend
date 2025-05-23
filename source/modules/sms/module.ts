import type { IModule } from "../../app/interfaces/IModule";
import { SmsHandler } from "./core/SmsHandler";

export class SmsModule implements IModule {
  private static sInstance: SmsModule;

  public static get instance(): SmsModule {
    if (SmsModule.sInstance === undefined) {
      SmsModule.sInstance = new SmsModule();
    }
    return SmsModule.sInstance;
  }

  private constructor(private readonly handler = new SmsHandler()) {
    this.send = this.handler.send.bind(this.handler);
    this.verify = this.handler.verify.bind(this.handler);
  }

  public readonly send: typeof this.handler.send;
  public readonly verify: typeof this.handler.verify;
}
