import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { VehicleType } from "../enums/VehicleType";

export class VehicleViewModel implements IModel {
  protected constructor(
    public readonly vehicleId: number,
    public readonly accountId: number,
    public readonly itemId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly brand: string | null,
    public readonly model: string | null,
    public readonly vehicleType: VehicleType | null,
    public readonly isDeleted: boolean,
  ) {}

  public static fromRecord(record: unknown): VehicleViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new VehicleViewModel(
      record.vehicleId,
      record.accountId,
      record.itemId,
      record.name,
      record.description,
      record.brand,
      record.model,
      record.vehicleType,
      record.isDeleted,
    );
  }

  public static fromRecords(records: unknown[]): VehicleViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): VehicleViewModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is VehicleViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as VehicleViewModel;
    return (
      typeof model.vehicleId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.itemId === "number" &&
      typeof model.name === "string" &&
      typeof model.description === "string" &&
      (model.brand === null || typeof model.brand === "string") &&
      (model.model === null || typeof model.model === "string") &&
      (model.vehicleType === null || Object.values(VehicleType).includes(model.vehicleType)) &&
      typeof model.isDeleted === "boolean"
    );
  }

  protected static areValidModels(data: unknown[]): data is VehicleViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
