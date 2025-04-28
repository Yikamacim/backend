import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class BankAccountModel implements IModel {
  protected constructor(
    public readonly businessId: number,
    public readonly owner: string,
    public readonly iban: string,
    public readonly balance: number,
  ) {}

  public static fromRecord(record: unknown): BankAccountModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BankAccountModel(record.businessId, record.owner, record.iban, record.balance);
  }

  public static fromRecords(records: unknown[]): BankAccountModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): BankAccountModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is BankAccountModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as BankAccountModel;
    return (
      typeof model.businessId === "number" &&
      typeof model.owner === "string" &&
      typeof model.iban === "string" &&
      typeof model.balance === "number"
    );
  }

  protected static areValidModels(data: unknown[]): data is BankAccountModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
