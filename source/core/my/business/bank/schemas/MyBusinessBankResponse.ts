import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { BankAccountModel } from "../../../../../common/models/BankAccountModel";

export class MyBusinessBankResponse implements IResponse {
  private constructor(
    public readonly owner: string,
    public readonly iban: string,
    public readonly balance: number,
  ) {}

  public static fromModel(model: BankAccountModel): MyBusinessBankResponse {
    return new MyBusinessBankResponse(model.owner, model.iban, model.balance);
  }
}
