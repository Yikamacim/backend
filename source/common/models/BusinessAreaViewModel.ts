import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class BusinessAreaViewModel implements IModel {
  protected constructor(
    public readonly businessId: number,
    public readonly countryId: number,
    public readonly countryName: string,
    public readonly provinceId: number,
    public readonly provinceName: string,
    public readonly districtId: number,
    public readonly districtName: string,
    public readonly neighborhoodId: number,
    public readonly neighborhoodName: string,
    public readonly area: string,
  ) {}

  public static fromRecord(record: unknown): BusinessAreaViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BusinessAreaViewModel(
      record.businessId,
      record.countryId,
      record.countryName,
      record.provinceId,
      record.provinceName,
      record.districtId,
      record.districtName,
      record.neighborhoodId,
      record.neighborhoodName,
      record.area,
    );
  }

  public static fromRecords(records: unknown[]): BusinessAreaViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): BusinessAreaViewModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is BusinessAreaViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as BusinessAreaViewModel;
    return (
      typeof model.businessId === "number" &&
      typeof model.countryId === "number" &&
      typeof model.countryName === "string" &&
      typeof model.provinceId === "number" &&
      typeof model.provinceName === "string" &&
      typeof model.districtId === "number" &&
      typeof model.districtName === "string" &&
      typeof model.neighborhoodId === "number" &&
      typeof model.neighborhoodName === "string" &&
      typeof model.area === "string"
    );
  }

  protected static areValidModels(data: unknown[]): data is BusinessAreaViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
