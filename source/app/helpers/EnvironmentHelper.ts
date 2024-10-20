import { Buffer } from "buffer";
import dotenv from "dotenv";
import type { Secret } from "jsonwebtoken";
import type { IHelper } from "../interfaces/IHelper.ts";

export class EnvironmentHelper implements IHelper {
  private static sInstance: EnvironmentHelper;

  // Variable names
  private static readonly JWT_SECRET_KEY = "LUFHJFJnXjk2KUk3";
  private static readonly POOL_USER_KEY = "Km8mVmN8NioyQjNJ";
  private static readonly POOL_HOST_KEY = "OVcyXUtgVy9oYmpj";
  private static readonly POOL_DATABASE_KEY = "YnlmfnJyXjlPRTV9";
  private static readonly POOL_PASSWORD_KEY = "bDkxWGohQiN1RD0h";
  private static readonly POOL_PORT_KEY = "IGggSFdbITNtO2o0";

  public static load(): EnvironmentHelper {
    if (!EnvironmentHelper.sInstance) {
      dotenv.config();
      EnvironmentHelper.sInstance = new EnvironmentHelper();
    }
    return EnvironmentHelper.sInstance;
  }

  public static get(): EnvironmentHelper {
    return EnvironmentHelper.load();
  }

  private readonly mJwtSecret: Secret;
  public get jwtSecret(): Secret {
    return this.mJwtSecret;
  }

  private readonly mPoolUser: string;
  public get poolUser(): string {
    return this.mPoolUser;
  }

  private readonly mPoolHost: string;
  public get poolHost(): string {
    return this.mPoolHost;
  }

  private readonly mPoolDatabase: string;
  public get poolDatabase(): string {
    return this.mPoolDatabase;
  }

  private readonly mPoolPassword: string;
  public get poolPassword(): string {
    return this.mPoolPassword;
  }

  private readonly mPoolPort: number;
  public get poolPort(): number {
    return this.mPoolPort;
  }

  private constructor() {
    this.mJwtSecret = this.loadJwtSecret();
    this.mPoolUser = this.loadPoolUser();
    this.mPoolHost = this.loadPoolHost();
    this.mPoolDatabase = this.loadPoolDatabase();
    this.mPoolPassword = this.loadPoolPassword();
    this.mPoolPort = this.loadPoolPort();
  }

  private loadJwtSecret(): Secret {
    const encodedJwtSecret: Secret | undefined = Deno.env.get(EnvironmentHelper.JWT_SECRET_KEY);
    if (!encodedJwtSecret) {
      throw new Error(`Environment variable "${EnvironmentHelper.JWT_SECRET_KEY}" is not defined!`);
    }
    return Buffer.from(encodedJwtSecret, "base64").toString("utf8");
  }

  private loadPoolUser(): string {
    const encodedPoolUser: string | undefined = Deno.env.get(EnvironmentHelper.POOL_USER_KEY);
    if (!encodedPoolUser) {
      throw new Error(`Environment variable "${EnvironmentHelper.POOL_USER_KEY}" is not defined!`);
    }
    return Buffer.from(encodedPoolUser, "base64").toString("utf8");
  }

  private loadPoolHost(): string {
    const encodedPoolHost: string | undefined = Deno.env.get(EnvironmentHelper.POOL_HOST_KEY);
    if (!encodedPoolHost) {
      throw new Error(`Environment variable "${EnvironmentHelper.POOL_HOST_KEY}" is not defined!`);
    }
    return Buffer.from(encodedPoolHost, "base64").toString("utf8");
  }

  private loadPoolDatabase(): string {
    const encodedPoolDatabase: string | undefined = Deno.env.get(
      EnvironmentHelper.POOL_DATABASE_KEY,
    );
    if (!encodedPoolDatabase) {
      throw new Error(
        `Environment variable "${EnvironmentHelper.POOL_DATABASE_KEY}" is not defined!`,
      );
    }
    return Buffer.from(encodedPoolDatabase, "base64").toString("utf8");
  }

  private loadPoolPassword(): string {
    const encodedPoolPassword: string | undefined = Deno.env.get(
      EnvironmentHelper.POOL_PASSWORD_KEY,
    );
    if (!encodedPoolPassword) {
      throw new Error(
        `Environment variable "${EnvironmentHelper.POOL_PASSWORD_KEY}" is not defined!`,
      );
    }
    return Buffer.from(encodedPoolPassword, "base64").toString("utf8");
  }

  private loadPoolPort(): number {
    const encodedPoolPort: string | undefined = Deno.env.get(EnvironmentHelper.POOL_PORT_KEY);
    if (!encodedPoolPort) {
      throw new Error(`Environment variable "${EnvironmentHelper.POOL_PORT_KEY}" is not defined!`);
    }
    return parseInt(Buffer.from(encodedPoolPort, "base64").toString("utf8"));
  }
}
