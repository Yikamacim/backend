import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class ReviewModel implements IModel {
  protected constructor(
    public readonly reviewId: number,
    public readonly accountId: number,
    public readonly businessId: number,
    public readonly orderId: number,
    public readonly stars: number,
    public readonly comment: string,
    public readonly leavedAt: Date,
  ) {}

  public static fromRecord(record: unknown): ReviewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new ReviewModel(
      record.reviewId,
      record.accountId,
      record.businessId,
      record.orderId,
      record.stars,
      record.comment,
      record.leavedAt,
    );
  }

  public static fromRecords(records: unknown[]): ReviewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): ReviewModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is ReviewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as ReviewModel;
    return (
      typeof model.reviewId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.businessId === "number" &&
      typeof model.orderId === "number" &&
      typeof model.stars === "number" &&
      typeof model.comment === "string" &&
      model.leavedAt instanceof Date
    );
  }

  protected static areValidModels(data: unknown[]): data is ReviewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
