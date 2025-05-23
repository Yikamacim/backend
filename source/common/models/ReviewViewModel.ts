import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class ReviewViewModel implements IModel {
  protected constructor(
    public readonly reviewId: number,
    public readonly businessId: number,
    public name: string,
    public surname: string,
    public readonly stars: number,
    public readonly comment: string,
    public readonly reply: string | null,
  ) {}

  public static fromRecord(record: unknown): ReviewViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new ReviewViewModel(
      record.reviewId,
      record.businessId,
      record.name,
      record.surname,
      record.stars,
      record.comment,
      record.reply,
    );
  }

  public static fromRecords(records: unknown[]): ReviewViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): ReviewViewModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is ReviewViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as ReviewViewModel;
    return (
      typeof model.reviewId === "number" &&
      typeof model.businessId === "number" &&
      typeof model.name === "string" &&
      typeof model.surname === "string" &&
      typeof model.stars === "number" &&
      typeof model.comment === "string" &&
      (model.reply === null || typeof model.reply === "string")
    );
  }

  protected static areValidModels(data: unknown[]): data is ReviewViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
