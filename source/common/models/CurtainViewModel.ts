import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ECurtainType } from "../enums/ECurtainType";

export class CurtainViewModel implements IModel {
  protected constructor(
    public readonly curtainId: number,
    public readonly accountId: number,
    public readonly itemId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly width: number | null,
    public readonly length: number | null,
    public readonly curtainType: ECurtainType | null,
    public readonly isDeleted: boolean,
  ) {}

  public static fromRecord(record: unknown): CurtainViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new CurtainViewModel(
      record.curtainId,
      record.accountId,
      record.itemId,
      record.name,
      record.description,
      record.width,
      record.length,
      record.curtainType,
      record.isDeleted,
    );
  }

  public static fromRecords(records: unknown[]): CurtainViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): CurtainViewModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is CurtainViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as CurtainViewModel;
    return (
      typeof model.curtainId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.itemId === "number" &&
      typeof model.name === "string" &&
      typeof model.description === "string" &&
      (model.width === null || typeof model.width === "number") &&
      (model.length === null || typeof model.length === "number") &&
      (model.curtainType === null || Object.values(ECurtainType).includes(model.curtainType)) &&
      typeof model.isDeleted === "boolean"
    );
  }

  protected static areValidModels(data: unknown[]): data is CurtainViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
