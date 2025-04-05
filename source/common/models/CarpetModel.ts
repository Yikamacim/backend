import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError";
import { CarpetMaterial } from "../enums/CarpetMaterial";

export class CarpetModel implements IModel {
  private constructor(
    public readonly carpetId: number,
    public readonly itemId: number,
    public readonly width: number | null,
    public readonly length: number | null,
    public readonly carpetMaterial: CarpetMaterial | null,
  ) {}

  public static fromRecord(record: unknown): CarpetModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
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

  private static isValidModel(data: unknown): data is CarpetModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model = data as CarpetModel;
    return (
      typeof model.carpetId === "number" &&
      typeof model.itemId === "number" &&
      typeof model.width === "number" &&
      typeof model.length === "number" &&
      (model.carpetMaterial === null ||
        Object.values(CarpetMaterial).includes(model.carpetMaterial))
    );
  }

  private static areValidModels(data: unknown[]): data is CarpetModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
