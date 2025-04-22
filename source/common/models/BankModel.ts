import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class BankModel implements IModel {
  protected constructor(
    public readonly businessId: number,
    public readonly iban: string,
    public readonly balance: number,
  ) {}

  public static fromRecord(record: unknown): BankModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BankModel(record.businessId, record.iban, record.balance);
  }

  public static fromRecords(records: unknown[]): BankModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): BankModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is BankModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as BankModel;
    return (
      typeof model.businessId === "number" &&
      typeof model.iban === "string" &&
      typeof model.balance === "number"
    );
  }

  protected static areValidModels(data: unknown[]): data is BankModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
