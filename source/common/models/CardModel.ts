import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class CardModel implements IModel {
  protected constructor(
    public readonly cardId: number,
    public readonly accountId: number,
    public readonly name: string,
    public readonly owner: string,
    public readonly number: string,
    public readonly expirationMonth: number,
    public readonly expirationYear: number,
    public readonly cvv: string,
    public readonly isDefault: boolean,
    public readonly isDeleted: boolean,
  ) {}

  public static fromRecord(record: unknown): CardModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new CardModel(
      record.cardId,
      record.accountId,
      record.name,
      record.owner,
      record.number,
      record.expirationMonth,
      record.expirationYear,
      record.cvv,
      record.isDefault,
      record.isDeleted,
    );
  }

  public static fromRecords(records: unknown[]): CardModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): CardModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is CardModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as CardModel;
    return (
      typeof model.cardId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.name === "string" &&
      typeof model.owner === "string" &&
      typeof model.number === "string" &&
      typeof model.expirationMonth === "number" &&
      typeof model.expirationYear === "number" &&
      typeof model.cvv === "string" &&
      typeof model.isDefault === "boolean" &&
      typeof model.isDeleted === "boolean"
    );
  }

  protected static areValidModels(data: unknown[]): data is CardModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
