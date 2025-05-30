import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { EVehicleType } from "../enums/EVehicleType";

export class VehicleModel implements IModel {
  protected constructor(
    public readonly vehicleId: number,
    public readonly itemId: number,
    public readonly brand: string | null,
    public readonly model: string | null,
    public readonly vehicleType: EVehicleType | null,
  ) {}

  public static fromRecord(record: unknown): VehicleModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new VehicleModel(
      record.vehicleId,
      record.itemId,
      record.brand,
      record.model,
      record.vehicleType,
    );
  }

  public static fromRecords(records: unknown[]): VehicleModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): VehicleModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is VehicleModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as VehicleModel;
    return (
      typeof model.vehicleId === "number" &&
      typeof model.itemId === "number" &&
      (model.brand === null || typeof model.brand === "string") &&
      (model.model === null || typeof model.model === "string") &&
      (model.vehicleType === null || Object.values(EVehicleType).includes(model.vehicleType))
    );
  }

  protected static areValidModels(data: unknown[]): data is VehicleModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
