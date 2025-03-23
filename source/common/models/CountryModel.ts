import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError";

export class CountryModel implements IModel {
  private constructor(
    public readonly countryId: number,
    public readonly name: string,
  ) {}

  public static fromRecord(record: unknown): CountryModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new CountryModel(record.countryId, record.name);
  }

  public static fromRecords(records: unknown[]): CountryModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): CountryModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is CountryModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model = data as CountryModel;
    return typeof model.countryId === "number" && typeof model.name === "string";
  }

  private static areValidModels(data: unknown[]): data is CountryModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
