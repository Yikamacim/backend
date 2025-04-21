import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class ChairModel implements IModel {
  protected constructor(
    public readonly chairId: number,
    public readonly itemId: number,
    public readonly quantity: number,
  ) {}

  public static fromRecord(record: unknown): ChairModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new ChairModel(record.chairId, record.itemId, record.quantity);
  }

  public static fromRecords(records: unknown[]): ChairModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): ChairModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is ChairModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as ChairModel;
    return (
      typeof model.chairId === "number" &&
      typeof model.itemId === "number" &&
      typeof model.quantity === "number"
    );
  }

  protected static areValidModels(data: unknown[]): data is ChairModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
