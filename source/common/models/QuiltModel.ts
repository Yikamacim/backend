import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { EQuiltMaterial } from "../enums/EQuiltMaterial";
import { EQuiltSize } from "../enums/EQuiltSize";

export class QuiltModel implements IModel {
  protected constructor(
    public readonly quiltId: number,
    public readonly itemId: number,
    public readonly quiltSize: EQuiltSize | null,
    public readonly quiltMaterial: EQuiltMaterial | null,
  ) {}

  public static fromRecord(record: unknown): QuiltModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new QuiltModel(record.quiltId, record.itemId, record.quiltSize, record.quiltMaterial);
  }

  public static fromRecords(records: unknown[]): QuiltModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): QuiltModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is QuiltModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as QuiltModel;
    return (
      typeof model.quiltId === "number" &&
      typeof model.itemId === "number" &&
      (model.quiltSize === null || Object.values(EQuiltSize).includes(model.quiltSize)) &&
      (model.quiltMaterial === null || Object.values(EQuiltMaterial).includes(model.quiltMaterial))
    );
  }

  protected static areValidModels(data: unknown[]): data is QuiltModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
