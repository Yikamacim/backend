import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class SessionModel implements IModel {
  public constructor(
    public readonly sessionId: number,
    public readonly accountId: number,
    public readonly deviceName: string,
    public readonly sessionKey: string,
    public readonly refreshToken: string,
    public readonly lastActivityDate: Date,
  ) {}

  public static fromRecord(record: unknown): SessionModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new SessionModel(
      record.sessionId,
      record.accountId,
      record.deviceName,
      record.sessionKey,
      record.refreshToken,
      record.lastActivityDate,
    );
  }

  public static fromRecords(records: unknown[]): SessionModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): SessionModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is SessionModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as SessionModel;
    return (
      typeof model.sessionId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.deviceName === "string" &&
      typeof model.sessionKey === "string" &&
      typeof model.refreshToken === "string" &&
      model.lastActivityDate instanceof Date
    );
  }

  private static areValidModels(data: unknown[]): data is SessionModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((obj: unknown): boolean => SessionModel.isValidModel(obj));
  }
}
