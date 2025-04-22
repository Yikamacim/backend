import type { IModule } from "../../app/interfaces/IModule";
import { AuthHandler } from "./core/AuthHandler";

export class AuthModule implements IModule {
  private static sInstance: AuthModule;

  public static get instance(): AuthModule {
    if (AuthModule.sInstance === undefined) {
      AuthModule.sInstance = new AuthModule();
    }
    return AuthModule.sInstance;
  }

  private constructor(private readonly handler = new AuthHandler()) {
    this.verify = this.handler.verify.bind(this.handler);
    this.getPayload = this.handler.getPayload.bind(this.handler);
    this.generate = this.handler.generate.bind(this.handler);
    this.refresh = this.handler.refresh.bind(this.handler);
    this.revoke = this.handler.revoke.bind(this.handler);
  }

  public readonly verify: typeof this.handler.verify;
  public readonly getPayload: typeof this.handler.getPayload;
  public readonly generate: typeof this.handler.generate;
  public readonly refresh: typeof this.handler.refresh;
  public readonly revoke: typeof this.handler.revoke;
}
