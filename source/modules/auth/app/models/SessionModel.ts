import type { IModel } from "../../../../app/interfaces/IModel.ts";
import { ModelMismatchError } from "../../../../app/schemas/ServerError.ts";

export class SessionModel implements IModel {
  constructor(
    readonly sessionId: number,
    readonly accountId: number,
    readonly sessionKey: string,
    readonly refreshToken: string,
    readonly lastActivityDate: Date,
  ) {}

  public static fromRecord(record: unknown): SessionModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new SessionModel(
      record.sessionId,
      record.accountId,
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
    const model: SessionModel = obj as SessionModel;
    return (
      typeof model.sessionId === "number" &&
      typeof model.accountId === "number" &&
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
