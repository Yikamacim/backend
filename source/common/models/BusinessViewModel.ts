import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ApprovalState } from "../enums/ApprovalState";

export class BusinessViewModel implements IModel {
  protected constructor(
    public readonly businessId: number,
    public readonly accountId: number,
    public readonly name: string,
    public readonly mediaId: number | null,
    public readonly addressId: number,
    public readonly countryId: number,
    public readonly countryName: string,
    public readonly provinceId: number,
    public readonly provinceName: string,
    public readonly districtId: number,
    public readonly districtName: string,
    public readonly neighborhoodId: number,
    public readonly neighborhoodName: string,
    public readonly explicitAddress: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly description: string,
    public readonly isOpen: boolean,
    public readonly stars: number | null,
    public readonly reviewsCount: number,
    public readonly approvalState: ApprovalState | null,
  ) {}

  public static fromRecord(record: unknown): BusinessViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BusinessViewModel(
      record.businessId,
      record.accountId,
      record.name,
      record.mediaId,
      record.addressId,
      record.countryId,
      record.countryName,
      record.provinceId,
      record.provinceName,
      record.districtId,
      record.districtName,
      record.neighborhoodId,
      record.neighborhoodName,
      record.explicitAddress,
      record.phone,
      record.email,
      record.description,
      record.isOpen,
      record.stars,
      record.reviewsCount,
      record.approvalState,
    );
  }

  public static fromRecords(records: unknown[]): BusinessViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): BusinessViewModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is BusinessViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as BusinessViewModel;
    return (
      typeof model.businessId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.name === "string" &&
      (model.mediaId === null || typeof model.mediaId === "number") &&
      typeof model.addressId === "number" &&
      typeof model.countryId === "number" &&
      typeof model.countryName === "string" &&
      typeof model.provinceId === "number" &&
      typeof model.provinceName === "string" &&
      typeof model.districtId === "number" &&
      typeof model.districtName === "string" &&
      typeof model.neighborhoodId === "number" &&
      typeof model.neighborhoodName === "string" &&
      typeof model.explicitAddress === "string" &&
      typeof model.phone === "string" &&
      typeof model.email === "string" &&
      typeof model.description === "string" &&
      typeof model.isOpen === "boolean" &&
      (model.stars === null || typeof model.stars === "number") &&
      typeof model.reviewsCount === "number" &&
      (model.approvalState === null || Object.values(ApprovalState).includes(model.approvalState))
    );
  }

  protected static areValidModels(data: unknown[]): data is BusinessViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
