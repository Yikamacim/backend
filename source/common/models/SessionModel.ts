import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";

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

  private static isValidModel(obj: unknown): obj is SessionModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model = obj as SessionModel;
    return (
      typeof model.sessionId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.deviceName === "string" &&
      typeof model.sessionKey === "string" &&
      typeof model.refreshToken === "string" &&
      model.lastActivityDate instanceof Date
    );
  }

  private static areValidModels(objs: unknown[]): objs is SessionModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj: unknown): boolean => SessionModel.isValidModel(obj));
  }
}
