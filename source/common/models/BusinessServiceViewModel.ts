import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { EServiceCategory } from "../enums/EServiceCategory";

export class BusinessServiceViewModel implements IModel {
  protected constructor(
    public readonly businessId: number,
    public readonly name: string,
    public readonly mediaId: number | null,
    public readonly countryName: string,
    public readonly provinceName: string,
    public readonly districtName: string,
    public readonly neighborhoodName: string,
    public readonly isOpen: boolean,
    public readonly stars: number | null,
    public readonly reviewsCount: number,
    public readonly serviceTitle: string,
    public readonly serviceCategory: EServiceCategory,
    public readonly isDeleted: boolean,
  ) {}

  public static fromRecord(record: unknown): BusinessServiceViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BusinessServiceViewModel(
      record.businessId,
      record.name,
      record.mediaId,
      record.countryName,
      record.provinceName,
      record.districtName,
      record.neighborhoodName,
      record.isOpen,
      record.stars,
      record.reviewsCount,
      record.serviceTitle,
      record.serviceCategory,
      record.isDeleted,
    );
  }

  public static fromRecords(records: unknown[]): BusinessServiceViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): BusinessServiceViewModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is BusinessServiceViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as BusinessServiceViewModel;
    return (
      typeof model.businessId === "number" &&
      typeof model.name === "string" &&
      (model.mediaId === null || typeof model.mediaId === "number") &&
      typeof model.countryName === "string" &&
      typeof model.provinceName === "string" &&
      typeof model.districtName === "string" &&
      typeof model.neighborhoodName === "string" &&
      typeof model.isOpen === "boolean" &&
      (model.stars === null || typeof model.stars === "number") &&
      typeof model.reviewsCount === "number" &&
      typeof model.serviceTitle === "string" &&
      Object.values(EServiceCategory).includes(model.serviceCategory) &&
      typeof model.isDeleted === "boolean"
    );
  }

  protected static areValidModels(data: unknown[]): data is BusinessServiceViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
