import type { IEntity } from "../../app/interfaces/IEntity";
import type { MessageModel } from "../models/MessageModel";

export class MessageEntity implements IEntity {
  public constructor(public readonly model: MessageModel) {}
}
