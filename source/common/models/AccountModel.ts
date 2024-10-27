import { AccountType } from "../../app/enums/AccountType.ts";
import type { IModel } from "../../app/interfaces/IModel.ts";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError.ts";

export class AccountModel implements IModel {
  private constructor(
    public readonly accountId: number,
    public readonly username: string,
    public readonly password: string,
    public readonly accountType: AccountType,
  ) {}

  public static fromRecord(record: unknown): AccountModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new AccountModel(record.accountId, record.username, record.password, record.accountType);
  }

  public static fromRecords(records: unknown[]): AccountModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): AccountModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is AccountModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model: AccountModel = data as AccountModel;
    return (
      typeof model.accountId === "number" &&
      typeof model.username === "string" &&
      typeof model.password === "string" &&
      Object.values(AccountType).includes(model.accountType)
    );
  }

  private static areValidModels(data: unknown[]): data is AccountModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
