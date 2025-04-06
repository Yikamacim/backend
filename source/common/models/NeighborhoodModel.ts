import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class NeighborhoodModel implements IModel {
  private constructor(
    public readonly neighborhoodId: number,
    public readonly districtId: number,
    public readonly name: string,
    public readonly postalCode: string,
  ) {}

  public static fromRecord(record: unknown): NeighborhoodModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new NeighborhoodModel(
      record.neighborhoodId,
      record.districtId,
      record.name,
      record.postalCode,
    );
  }

  public static fromRecords(records: unknown[]): NeighborhoodModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): NeighborhoodModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is NeighborhoodModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as NeighborhoodModel;
    return (
      typeof model.neighborhoodId === "number" &&
      typeof model.districtId === "number" &&
      typeof model.name === "string" &&
      typeof model.postalCode === "string"
    );
  }

  private static areValidModels(data: unknown[]): data is NeighborhoodModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
