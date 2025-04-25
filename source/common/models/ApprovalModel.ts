import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ApprovalState } from "../enums/ApprovalState";

export class ApprovalModel implements IModel {
  protected constructor(
    public readonly businessId: number,
    public readonly message: string | null,
    public readonly approvalState: ApprovalState,
    public readonly reason: string | null,
    public readonly createdAt: Date,
  ) {}

  public static fromRecord(record: unknown): ApprovalModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new ApprovalModel(
      record.businessId,
      record.message,
      record.approvalState,
      record.reason,
      record.createdAt,
    );
  }

  public static fromRecords(records: unknown[]): ApprovalModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): ApprovalModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is ApprovalModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as ApprovalModel;
    return (
      typeof model.businessId === "number" &&
      typeof model.message === "string" &&
      Object.values(ApprovalState).includes(model.approvalState) &&
      (model.reason === null || typeof model.reason === "string") &&
      model.createdAt instanceof Date
    );
  }

  protected static areValidModels(data: unknown[]): data is ApprovalModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
