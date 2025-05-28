import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class MessageModel implements IModel {
  protected constructor(
    public readonly messageId: number,
    public readonly orderId: number,
    public readonly fromBusiness: boolean,
    public readonly content: string,
    public readonly sentAt: Date,
  ) {}

  public static fromRecord(record: unknown): MessageModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new MessageModel(
      record.messageId,
      record.orderId,
      record.fromBusiness,
      record.content,
      record.sentAt,
    );
  }

  public static fromRecords(records: unknown[]): MessageModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): MessageModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is MessageModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as MessageModel;
    return (
      typeof model.messageId === "number" &&
      typeof model.orderId === "number" &&
      typeof model.fromBusiness === "boolean" &&
      typeof model.content === "string" &&
      model.sentAt instanceof Date
    );
  }

  protected static areValidModels(data: unknown[]): data is MessageModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
