import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { QuiltMaterial } from "../enums/QuiltMaterial";
import { QuiltSize } from "../enums/QuiltSize";

export class QuiltViewModel implements IModel {
  private constructor(
    public readonly quiltId: number,
    public readonly accountId: number,
    public readonly itemId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly quiltSize: QuiltSize | null,
    public readonly quiltMaterial: QuiltMaterial | null,
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
    );
  }

  public static fromRecords(records: unknown[]): QuiltViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): QuiltViewModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is QuiltViewModel {
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
      (model.quiltSize === null || Object.values(QuiltSize).includes(model.quiltSize)) &&
      (model.quiltMaterial === null || Object.values(QuiltMaterial).includes(model.quiltMaterial))
    );
  }

  private static areValidModels(data: unknown[]): data is QuiltViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
