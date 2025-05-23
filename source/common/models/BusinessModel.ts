import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class BusinessModel implements IModel {
  protected constructor(
    public readonly businessId: number,
    public readonly accountId: number,
    public readonly name: string,
    public readonly addressId: number,
    public readonly phone: string,
    public readonly email: string,
    public readonly description: string,
    public readonly isOpen: boolean,
  ) {}

  public static fromRecord(record: unknown): BusinessModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BusinessModel(
      record.businessId,
      record.accountId,
      record.name,
      record.addressId,
      record.phone,
      record.email,
      record.description,
      record.isOpen,
    );
  }

  public static fromRecords(records: unknown[]): BusinessModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): BusinessModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is BusinessModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as BusinessModel;
    return (
      typeof model.businessId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.name === "string" &&
      typeof model.addressId === "number" &&
      typeof model.phone === "string" &&
      typeof model.email === "string" &&
      typeof model.description === "string" &&
      typeof model.isOpen === "boolean"
    );
  }

  protected static areValidModels(data: unknown[]): data is BusinessModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
