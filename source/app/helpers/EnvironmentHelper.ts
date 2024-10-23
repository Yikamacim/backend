import { decodeBase64Url } from "@std/encoding";
import dotenv from "dotenv";
import type { Secret } from "jsonwebtoken";
import type { IHelper } from "../interfaces/IHelper.ts";

export class EnvironmentHelper implements IHelper {
  private static sInstance: EnvironmentHelper;

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

  public static isProduction(): boolean {
    return Deno.args.includes("--production") || Deno.args.includes("-p");
  }

  public get jwtSecret(): Secret {
    return this.mJwtSecret;
  }

  public get poolUser(): string {
    return this.mPoolUser;
  }

  public get poolHost(): string {
    return this.mPoolHost;
  }

  public get poolDatabase(): string {
    return this.mPoolDatabase;
  }

  public get poolPort(): number {
    return this.mPoolPort;
  }

  private constructor(
    private readonly mJwtSecret: Secret = this.loadJwtSecret(),
    private readonly mPoolUser: string = this.loadPoolUser(),
    private readonly mPoolHost: string = this.loadPoolHost(),
    private readonly mPoolDatabase: string = this.loadPoolDatabase(),
    private readonly mPoolPort: number = this.loadPoolPort(),
  ) {}

  private getEnvValue(keyParts: string[], isShared: boolean): string {
    const prefix = isShared ? "SHRD" : EnvironmentHelper.isProduction() ? "PROD" : "DEVT";
    let envValue = "";
    for (const keyPart of keyParts) {
      const valuePart = Deno.env.get(`${prefix}_${keyPart}`);
      if (!valuePart) {
        throw new Error(`Environment variable "${prefix}_${keyPart}" is not defined!`);
      }
      envValue += valuePart;
    }
    return envValue;
  }

  private loadJwtSecret(): Secret {
    const encoded = this.getEnvValue([
      "JXCQ_SBWR",
      "JQXE_SBPN",
      "JBAX_SFBI",
      "JYQQ_SXWY",
      "JRGM_SGXD",
    ], true);
    return new TextDecoder("utf-8").decode(decodeBase64Url(encoded));
  }

  private loadPoolUser(): string {
    const encoded = this.getEnvValue(["PXED_UGGO", "PIXI_UVFJ"], false);
    return new TextDecoder("utf-8").decode(decodeBase64Url(encoded));
  }

  private loadPoolHost(): string {
    const encoded = this.getEnvValue(["PXVL_HCMN", "PYXI_HCDU"], false);
    return new TextDecoder("utf-8").decode(decodeBase64Url(encoded));
  }

  private loadPoolDatabase(): string {
    const encoded = this.getEnvValue(["PXCU_DILF", "PQXG_DWEK"], false);
    return new TextDecoder("utf-8").decode(decodeBase64Url(encoded));
  }

  private loadPoolPort(): number {
    const encoded = this.getEnvValue(["PXAS_PFBR", "PDXA_PJTY"], false);
    return parseInt(new TextDecoder("utf-8").decode(decodeBase64Url(encoded)));
  }
}
