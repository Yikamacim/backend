import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class VerificationModel implements IModel {
  public constructor(
    public readonly verificationId: number,
    public readonly phone: string,
    public readonly code: string,
    public readonly sentAt: Date,
  ) {}

  public static fromRecord(record: unknown): VerificationModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new VerificationModel(record.verificationId, record.phone, record.code, record.sentAt);
  }

  public static fromRecords(records: unknown[]): VerificationModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): VerificationModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is VerificationModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as VerificationModel;
    return (
      typeof model.verificationId === "number" &&
      typeof model.phone === "string" &&
      typeof model.code === "string" &&
      model.sentAt instanceof Date
    );
  }

  private static areValidModels(data: unknown[]): data is VerificationModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((obj: unknown): boolean => VerificationModel.isValidModel(obj));
  }
}
