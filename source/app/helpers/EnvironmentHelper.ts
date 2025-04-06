import dotenv from "dotenv";
import type { Secret } from "jsonwebtoken";
import type { IHelper } from "../interfaces/IHelper";

export class EnvironmentHelper implements IHelper {
  private static sInstance: EnvironmentHelper;

  public static load(): EnvironmentHelper {
    if (EnvironmentHelper.sInstance === undefined) {
      dotenv.config();
      EnvironmentHelper.sInstance = new EnvironmentHelper();
    }
    return EnvironmentHelper.sInstance;
  }

  public static get(): EnvironmentHelper {
    return EnvironmentHelper.load();
  }

  public static isProduction(): boolean {
    return process.argv.includes("--production") || process.argv.includes("-p");
  }

  public get jwtSecret(): Secret {
    return this.mJwtSecret;
  }

  public get awsRegion(): string {
    return this.mAwsRegion;
  }

  public get bucketName(): string {
    return this.mBucketName;
  }

  public get twilioAccountSid(): string {
    return this.mTwilioAccountSid;
  }

  public get twilioAuthToken(): string {
    return this.mTwilioAuthToken;
  }

  public get twilioPhoneNumber(): string {
    return this.mTwilioPhoneNumber;
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
    private readonly mJwtSecret = this.loadJwtSecret(),
    private readonly mAwsRegion = this.loadAwsRegion(),
    private readonly mBucketName = this.loadBucketName(),
    private readonly mTwilioAccountSid = this.loadTwilioAccountSid(),
    private readonly mTwilioAuthToken = this.loadTwilioAuthToken(),
    private readonly mTwilioPhoneNumber = this.loadTwilioPhoneNumber(),
    private readonly mPoolUser = this.loadPoolUser(),
    private readonly mPoolHost = this.loadPoolHost(),
    private readonly mPoolDatabase = this.loadPoolDatabase(),
    private readonly mPoolPort = this.loadPoolPort(),
  ) {}

  private getEnvValue(keyParts: string[], isShared: boolean): string {
    const prefix = isShared ? "SHRD" : EnvironmentHelper.isProduction() ? "PROD" : "DEVT";
    let envValue = "";
    for (const keyPart of keyParts) {
      const valuePart = process.env[`${prefix}_${keyPart}`];
      if (valuePart === undefined) {
        throw new Error(`Environment variable "${prefix}_${keyPart}" is not defined!`);
      }
      envValue += valuePart;
    }
    return envValue;
  }

  private loadJwtSecret(): Secret {
    const encoded = this.getEnvValue(
      ["JXCQ_SBWR", "JQXE_SBPN", "JBAX_SFBI", "JYQQ_SXWY", "JRGM_SGXD"],
      true,
    );
    return Buffer.from(encoded, "base64url").toString("utf-8");
  }

  private loadAwsRegion(): string {
    const encoded = this.getEnvValue(["AXIL_RKFH", "AVXT_RJME"], true);
    return Buffer.from(encoded, "base64url").toString("utf-8");
  }

  private loadBucketName(): string {
    const encoded = this.getEnvValue(["BXOG_NDOS", "BIXI_NKLK"], true);
    return Buffer.from(encoded, "base64url").toString("utf-8");
  }

  private loadTwilioAccountSid(): string {
    const encoded = this.getEnvValue(
      ["TXJK_IKJH", "TYXK_ILFT", "TKRX_IPVR", "TBZK_IXZG", "TEQL_ICXN"],
      true,
    );
    return Buffer.from(encoded, "base64url").toString("utf-8");
  }

  private loadTwilioAuthToken(): string {
    const encoded = this.getEnvValue(
      ["TXLO_TKVN", "TYXZ_TNLI", "TAQX_TKZP", "TNME_TXGH", "TEQZ_TFXA"],
      true,
    );
    return Buffer.from(encoded, "base64url").toString("utf-8");
  }

  private loadTwilioPhoneNumber(): string {
    const encoded = this.getEnvValue(["TXRA_PKZC", "TVXA_PHFZ"], true);
    return Buffer.from(encoded, "base64url").toString("utf-8");
  }

  private loadPoolUser(): string {
    const encoded = this.getEnvValue(["PXED_UGGO", "PIXI_UVFJ"], false);
    return Buffer.from(encoded, "base64url").toString("utf-8");
  }

  private loadPoolHost(): string {
    const encoded = this.getEnvValue(["PXVL_HCMN", "PYXI_HCDU"], false);
    return Buffer.from(encoded, "base64url").toString("utf-8");
  }

  private loadPoolDatabase(): string {
    const encoded = this.getEnvValue(["PXCU_DILF", "PQXG_DWEK"], false);
    return Buffer.from(encoded, "base64url").toString("utf-8");
  }

  private loadPoolPort(): number {
    const encoded = this.getEnvValue(["PXAS_PFBR", "PDXA_PJTY"], false);
    return parseInt(Buffer.from(encoded, "base64url").toString("utf-8"));
  }
}
