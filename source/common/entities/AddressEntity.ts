import type { IEntity } from "../../app/interfaces/IEntity";
import type { AddressViewModel } from "../models/AddressViewModel";

export class AddressEntity implements IEntity {
  public constructor(public readonly model: AddressViewModel) {}
}
