import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ECarpetMaterial } from "../enums/ECarpetMaterial";

export class CarpetModel implements IModel {
  protected constructor(
    public readonly carpetId: number,
    public readonly itemId: number,
    public readonly width: number | null,
    public readonly length: number | null,
    public readonly carpetMaterial: ECarpetMaterial | null,
  ) {}

  public static fromRecord(record: unknown): CarpetModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new CarpetModel(
      record.carpetId,
      record.itemId,
      record.width,
      record.length,
      record.carpetMaterial,
    );
  }

  public static fromRecords(records: unknown[]): CarpetModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): CarpetModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is CarpetModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as CarpetModel;
    return (
      typeof model.carpetId === "number" &&
      typeof model.itemId === "number" &&
      (model.width === null || typeof model.width === "number") &&
      (model.length === null || typeof model.length === "number") &&
      (model.carpetMaterial === null ||
        Object.values(ECarpetMaterial).includes(model.carpetMaterial))
    );
  }

  protected static areValidModels(data: unknown[]): data is CarpetModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
