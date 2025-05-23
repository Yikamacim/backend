import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class DistrictModel implements IModel {
  protected constructor(
    public readonly districtId: number,
    public readonly provinceId: number,
    public readonly name: string,
  ) {}

  public static fromRecord(record: unknown): DistrictModel {
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

  protected static isValidModel(data: unknown): data is DistrictModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as DistrictModel;
    return (
      typeof model.districtId === "number" &&
      typeof model.provinceId === "number" &&
      typeof model.name === "string"
    );
  }

  protected static areValidModels(data: unknown[]): data is DistrictModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
