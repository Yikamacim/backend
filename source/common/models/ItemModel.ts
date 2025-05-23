import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class ItemModel implements IModel {
  protected constructor(
    public readonly itemId: number,
    public readonly accountId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly isDeleted: boolean,
  ) {}

  public static fromRecord(record: unknown): ItemModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new ItemModel(
      record.itemId,
      record.accountId,
      record.name,
      record.description,
      record.isDeleted,
    );
  }

  public static fromRecords(records: unknown[]): ItemModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): ItemModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is ItemModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as ItemModel;
    return (
      typeof model.itemId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.name === "string" &&
      typeof model.description === "string" &&
      typeof model.isDeleted === "boolean"
    );
  }

  protected static areValidModels(data: unknown[]): data is ItemModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
