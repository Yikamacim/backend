import type { SessionData } from "../../@types/sessions.d.ts";
import type { Token } from "../../@types/tokens.d.ts";
import type { IModule } from "../../app/interfaces/IModule.ts";
import { TokenGenerator } from "./core/TokenGenerator.ts";
import { TokenVerifier } from "./core/TokenVerifier.ts";

export class AuthModule implements IModule {
  private static sInstance: AuthModule;

  public static get instance(): AuthModule {
    if (!AuthModule.sInstance) {
      AuthModule.sInstance = new AuthModule();
    }
    return AuthModule.sInstance;
  }

  private constructor() {}

  public withData(data: SessionData): TokenGenerator {
    return new TokenGenerator(data);
  }

  public withToken(token: Token): TokenVerifier {
    return new TokenVerifier(token);
  }
}
