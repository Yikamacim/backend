import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError";
import { CarpetMaterial } from "../enums/CarpetMaterial";

export class CarpetViewModel implements IModel {
  private constructor(
    public readonly carpetId: number,
    public readonly accountId: number,
    public readonly itemId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly width: number | null,
    public readonly length: number | null,
    public readonly carpetMaterial: CarpetMaterial | null,
  ) {}

  public static fromRecord(record: unknown): CarpetViewModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new CarpetViewModel(
      record.carpetId,
      record.accountId,
      record.itemId,
      record.name,
      record.description,
      record.width,
      record.length,
      record.carpetMaterial,
    );
  }

  public static fromRecords(records: unknown[]): CarpetViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): CarpetViewModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is CarpetViewModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model = data as CarpetViewModel;
    return (
      typeof model.carpetId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.itemId === "number" &&
      typeof model.name === "string" &&
      typeof model.description === "string" &&
      typeof model.width === "number" &&
      typeof model.length === "number" &&
      (model.carpetMaterial === null ||
        Object.values(CarpetMaterial).includes(model.carpetMaterial))
    );
  }

  private static areValidModels(data: unknown[]): data is CarpetViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
