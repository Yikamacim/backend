import type { IEntity } from "../../app/interfaces/IEntity";
import type { CountryModel } from "../models/CountryModel";

export class CountryEntity implements IEntity {
  public constructor(public readonly model: CountryModel) {}
}
