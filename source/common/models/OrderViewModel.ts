import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { EOrderState } from "../enums/EOrderState";
import { EServiceCategory } from "../enums/EServiceCategory";

export class OrderViewModel implements IModel {
  protected constructor(
    public readonly orderId: number,
    public readonly serviceId: number,
    public readonly serviceTitle: string,
    public readonly serviceMediaId: number | null,
    public readonly serviceCategory: EServiceCategory,
    public readonly serviceDescription: string,
    public readonly unitPrice: number,
    public readonly countryName: string,
    public readonly provinceName: string,
    public readonly districtName: string,
    public readonly neighborhoodName: string,
    public readonly businessId: number,
    public readonly businessName: string,
    public readonly businessMediaId: number | null,
    public readonly businessPhone: string,
    public readonly businessEmail: string,
    public readonly isOpen: boolean,
    public readonly stars: number | null,
    public readonly reviewsCount: number,
    public readonly accountId: number,
    public readonly customerPhone: string,
    public readonly customerName: string,
    public readonly customerSurname: string,
    public readonly orderState: EOrderState,
    public readonly price: number | null,
    public readonly isReviewed: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static fromRecord(record: unknown): OrderViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new OrderViewModel(
      record.orderId,
      record.serviceId,
      record.serviceTitle,
      record.serviceMediaId,
      record.serviceCategory,
      record.serviceDescription,
      record.unitPrice,
      record.countryName,
      record.provinceName,
      record.districtName,
      record.neighborhoodName,
      record.businessId,
      record.businessName,
      record.businessMediaId,
      record.businessPhone,
      record.businessEmail,
      record.isOpen,
      record.stars,
      record.reviewsCount,
      record.accountId,
      record.customerPhone,
      record.customerName,
      record.customerSurname,
      record.orderState,
      record.price,
      record.isReviewed,
      record.createdAt,
      record.updatedAt,
    );
  }

  public static fromRecords(records: unknown[]): OrderViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): OrderViewModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is OrderViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as OrderViewModel;
    return (
      typeof model.orderId === "number" &&
      typeof model.serviceId === "number" &&
      typeof model.serviceTitle === "string" &&
      (model.serviceMediaId === null || typeof model.serviceMediaId === "number") &&
      Object.values(EServiceCategory).includes(model.serviceCategory) &&
      typeof model.serviceDescription === "string" &&
      typeof model.unitPrice === "number" &&
      typeof model.countryName === "string" &&
      typeof model.provinceName === "string" &&
      typeof model.districtName === "string" &&
      typeof model.neighborhoodName === "string" &&
      typeof model.businessId === "number" &&
      typeof model.businessName === "string" &&
      (model.businessMediaId === null || typeof model.businessMediaId === "number") &&
      typeof model.businessPhone === "string" &&
      typeof model.businessEmail === "string" &&
      typeof model.isOpen === "boolean" &&
      (model.stars === null || typeof model.stars === "number") &&
      typeof model.reviewsCount === "number" &&
      typeof model.accountId === "number" &&
      typeof model.customerPhone === "string" &&
      typeof model.customerName === "string" &&
      typeof model.customerSurname === "string" &&
      Object.values(EOrderState).includes(model.orderState) &&
      (model.price === null || typeof model.price === "number") &&
      typeof model.isReviewed === "boolean" &&
      model.createdAt instanceof Date &&
      model.updatedAt instanceof Date
    );
  }

  protected static areValidModels(data: unknown[]): data is OrderViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
