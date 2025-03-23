import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError";

export class ProvinceModel implements IModel {
  private constructor(
    public readonly provinceId: number,
    public readonly countryId: number,
    public readonly name: string,
  ) {}

  public static fromRecord(record: unknown): ProvinceModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new ProvinceModel(record.provinceId, record.countryId, record.name);
  }

  public static fromRecords(records: unknown[]): ProvinceModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): ProvinceModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is ProvinceModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model = data as ProvinceModel;
    return (
      typeof model.provinceId === "number" &&
      typeof model.countryId === "number" &&
      typeof model.name === "string"
    );
  }

  private static areValidModels(data: unknown[]): data is ProvinceModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
