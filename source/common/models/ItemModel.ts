import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError";

export class ItemModel implements IModel {
  private constructor(
    public readonly itemId: number,
    public readonly accountId: number,
    public readonly name: string,
    public readonly description: string,
  ) {}

  public static fromRecord(record: unknown): ItemModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new ItemModel(record.itemId, record.accountId, record.name, record.description);
  }

  public static fromRecords(records: unknown[]): ItemModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): ItemModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is ItemModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model = data as ItemModel;
    return (
      typeof model.itemId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.name === "string" &&
      typeof model.description === "string"
    );
  }

  private static areValidModels(data: unknown[]): data is ItemModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
