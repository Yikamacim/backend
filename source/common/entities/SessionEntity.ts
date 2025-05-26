import type { IEntity } from "../../app/interfaces/IEntity";
import type { SessionModel } from "../models/SessionModel";

export class SessionEntity implements IEntity {
  public constructor(
    public readonly model: SessionModel,
    public readonly isCurrent: boolean,
  ) {}
}
