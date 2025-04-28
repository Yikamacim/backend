import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ServiceCategory } from "../enums/ServiceCategory";

export class ServiceModel implements IModel {
  protected constructor(
    public readonly serviceId: number,
    public readonly businessId: number,
    public readonly title: string,
    public readonly mediaId: number | null,
    public readonly serviceCategory: ServiceCategory,
    public readonly description: string,
    public readonly unitPrice: number,
  ) {}

  public static fromRecord(record: unknown): ServiceModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new ServiceModel(
      record.serviceId,
      record.businessId,
      record.title,
      record.mediaId,
      record.serviceCategory,
      record.description,
      record.unitPrice,
    );
  }

  public static fromRecords(records: unknown[]): ServiceModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): ServiceModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is ServiceModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as ServiceModel;
    return (
      typeof model.serviceId === "number" &&
      typeof model.businessId === "number" &&
      typeof model.title === "string" &&
      (model.mediaId === null || typeof model.mediaId === "number") &&
      Object.values(ServiceCategory).includes(model.serviceCategory) &&
      typeof model.description === "string" &&
      typeof model.unitPrice === "number"
    );
  }

  protected static areValidModels(data: unknown[]): data is ServiceModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
