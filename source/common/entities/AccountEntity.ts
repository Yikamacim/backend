import type { IEntity } from "../../app/interfaces/IEntity";
import type { AccountModel } from "../models/AccountModel";

export class AccountEntity implements IEntity {
  public constructor(public readonly model: AccountModel) {}
}
