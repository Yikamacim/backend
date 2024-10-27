import type { SessionData } from "../../../@types/sessions.d.ts";
import type { Tokens } from "../../../@types/tokens.d.ts";
import type { IGenerator } from "../app/interfaces/IGenerator.ts";
import { SessionHandler } from "./SessionHandler.ts";

export class TokenGenerator implements IGenerator {
  private readonly mData: SessionData;

  public constructor(data: SessionData) {
    this.mData = data;
  }

  public async generateTokens(): Promise<Tokens> {
    return (await SessionHandler.createOrUpdateSession(this.mData)).data;
  }
}
