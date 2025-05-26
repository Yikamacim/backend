import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { EQuiltMaterial } from "../enums/EQuiltMaterial";
import { EQuiltSize } from "../enums/EQuiltSize";

export class QuiltViewModel implements IModel {
  protected constructor(
    public readonly quiltId: number,
    public readonly accountId: number,
    public readonly itemId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly quiltSize: EQuiltSize | null,
    public readonly quiltMaterial: EQuiltMaterial | null,
    public readonly isDeleted: boolean,
  ) {}

  public static fromRecord(record: unknown): QuiltViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new QuiltViewModel(
      record.quiltId,
      record.accountId,
      record.itemId,
      record.name,
      record.description,
      record.quiltSize,
      record.quiltMaterial,
      record.isDeleted,
    );
  }

  public static fromRecords(records: unknown[]): QuiltViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): QuiltViewModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is QuiltViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as QuiltViewModel;
    return (
      typeof model.quiltId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.itemId === "number" &&
      typeof model.name === "string" &&
      typeof model.description === "string" &&
      (model.quiltSize === null || Object.values(EQuiltSize).includes(model.quiltSize)) &&
      (model.quiltMaterial === null ||
        Object.values(EQuiltMaterial).includes(model.quiltMaterial)) &&
      typeof model.isDeleted === "boolean"
    );
  }

  protected static areValidModels(data: unknown[]): data is QuiltViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
