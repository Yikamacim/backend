import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { EOrderState } from "../enums/EOrderState";

export class OrderModel implements IModel {
  protected constructor(
    public readonly orderId: number,
    public readonly serviceId: number,
    public readonly addressId: number,
    public readonly accountId: number,
    public readonly orderState: EOrderState,
    public readonly price: number | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static fromRecord(record: unknown): OrderModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new OrderModel(
      record.orderId,
      record.serviceId,
      record.addressId,
      record.accountId,
      record.orderState,
      record.price,
      record.createdAt,
      record.updatedAt,
    );
  }

  public static fromRecords(records: unknown[]): OrderModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): OrderModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is OrderModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as OrderModel;
    return (
      typeof model.orderId === "number" &&
      typeof model.serviceId === "number" &&
      typeof model.addressId === "number" &&
      typeof model.accountId === "number" &&
      Object.values(EOrderState).includes(model.orderState) &&
      (model.price === null || typeof model.price === "number") &&
      model.createdAt instanceof Date &&
      model.updatedAt instanceof Date
    );
  }

  protected static areValidModels(data: unknown[]): data is OrderModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
