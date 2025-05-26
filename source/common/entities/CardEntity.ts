import type { IEntity } from "../../app/interfaces/IEntity";
import type { CardModel } from "../models/CardModel";

export class CardEntity implements IEntity {
  public constructor(public readonly model: CardModel) {}
}
