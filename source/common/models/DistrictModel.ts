import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError";

export class DistrictModel implements IModel {
  private constructor(
    public readonly districtId: number,
    public readonly provinceId: number,
    public readonly name: string,
  ) {}

  public static fromRecord(record: unknown): DistrictModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new DistrictModel(record.districtId, record.provinceId, record.name);
  }

  public static fromRecords(records: unknown[]): DistrictModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): DistrictModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is DistrictModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model = data as DistrictModel;
    return (
      typeof model.districtId === "number" &&
      typeof model.provinceId === "number" &&
      typeof model.name === "string"
    );
  }

  private static areValidModels(data: unknown[]): data is DistrictModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
