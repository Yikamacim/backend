import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { AccountType } from "../enums/AccountType";

export class AccountModel implements IModel {
  protected constructor(
    public readonly accountId: number,
    public readonly phone: string,
    public readonly password: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly accountType: AccountType,
    public readonly isVerified: boolean,
  ) {}

  public static fromRecord(record: unknown): AccountModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new AccountModel(
      record.accountId,
      record.phone,
      record.password,
      record.name,
      record.surname,
      record.accountType,
      record.isVerified,
    );
  }

  public static fromRecords(records: unknown[]): AccountModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): AccountModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is AccountModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as AccountModel;
    return (
      typeof model.accountId === "number" &&
      typeof model.phone === "string" &&
      typeof model.password === "string" &&
      typeof model.name === "string" &&
      typeof model.surname === "string" &&
      Object.values(AccountType).includes(model.accountType) &&
      typeof model.isVerified === "boolean"
    );
  }

  protected static areValidModels(data: unknown[]): data is AccountModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
