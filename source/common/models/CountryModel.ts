import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class CountryModel implements IModel {
  protected constructor(
    public readonly countryId: number,
    public readonly name: string,
  ) {}

  public static fromRecord(record: unknown): CountryModel {
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

  protected static isValidModel(data: unknown): data is CountryModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as CountryModel;
    return typeof model.countryId === "number" && typeof model.name === "string";
  }

  protected static areValidModels(data: unknown[]): data is CountryModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
