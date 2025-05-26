import type { IEntity } from "../../app/interfaces/IEntity";
import type { BankAccountModel } from "../models/BankAccountModel";

export class BankAccountEntity implements IEntity {
  public constructor(public readonly model: BankAccountModel) {}
}
