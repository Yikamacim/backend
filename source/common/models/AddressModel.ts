import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError";

export class AddressModel implements IModel {
  private constructor(
    public readonly addressId: number,
    public readonly accountId: number,
    public readonly name: string,
    public readonly countryId: number,
    public readonly provinceId: number,
    public readonly districtId: number,
    public readonly neighborhoodId: number,
    public readonly explicitAddress: string,
    public readonly isDefault: boolean,
  ) {}

  public static fromRecord(record: unknown): AddressModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new AddressModel(
      record.addressId,
      record.accountId,
      record.name,
      record.countryId,
      record.provinceId,
      record.districtId,
      record.neighborhoodId,
      record.explicitAddress,
      record.isDefault,
    );
  }

  public static fromRecords(records: unknown[]): AddressModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): AddressModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is AddressModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model = data as AddressModel;
    return (
      typeof model.addressId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.name === "string" &&
      typeof model.countryId === "number" &&
      typeof model.provinceId === "number" &&
      typeof model.districtId === "number" &&
      typeof model.neighborhoodId === "number" &&
      typeof model.explicitAddress === "string" &&
      typeof model.isDefault === "boolean"
    );
  }

  private static areValidModels(data: unknown[]): data is AddressModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
