import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class AddressViewModel implements IModel {
  protected constructor(
    public readonly addressId: number,
    public readonly accountId: number,
    public readonly name: string,
    public readonly countryId: number,
    public readonly countryName: string,
    public readonly provinceId: number,
    public readonly provinceName: string,
    public readonly districtId: number,
    public readonly districtName: string,
    public readonly neighborhoodId: number,
    public readonly neighborhoodName: string,
    public readonly explicitAddress: string,
    public readonly isDefault: boolean,
  ) {}

  public static fromRecord(record: unknown): AddressViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new AddressViewModel(
      record.addressId,
      record.accountId,
      record.name,
      record.countryId,
      record.countryName,
      record.provinceId,
      record.provinceName,
      record.districtId,
      record.districtName,
      record.neighborhoodId,
      record.neighborhoodName,
      record.explicitAddress,
      record.isDefault,
    );
  }

  public static fromRecords(records: unknown[]): AddressViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): AddressViewModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is AddressViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as AddressViewModel;
    return (
      typeof model.addressId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.name === "string" &&
      typeof model.countryId === "number" &&
      typeof model.countryName === "string" &&
      typeof model.provinceId === "number" &&
      typeof model.provinceName === "string" &&
      typeof model.districtId === "number" &&
      typeof model.districtName === "string" &&
      typeof model.neighborhoodId === "number" &&
      typeof model.neighborhoodName === "string" &&
      typeof model.explicitAddress === "string" &&
      typeof model.isDefault === "boolean"
    );
  }

  protected static areValidModels(data: unknown[]): data is AddressViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
