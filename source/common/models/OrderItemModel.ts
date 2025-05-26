import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class OrderItemModel implements IModel {
  protected constructor(
    public readonly orderId: number,
    public readonly itemId: number,
  ) {}

  public static fromRecord(record: unknown): OrderItemModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new OrderItemModel(record.orderId, record.itemId);
  }

  public static fromRecords(records: unknown[]): OrderItemModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): OrderItemModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is OrderItemModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as OrderItemModel;
    return typeof model.orderId === "number" && typeof model.itemId === "number";
  }

  protected static areValidModels(data: unknown[]): data is OrderItemModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
