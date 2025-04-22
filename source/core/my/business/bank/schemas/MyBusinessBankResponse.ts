import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { BankModel } from "../../../../../common/models/BankModel";

export class MyBusinessBankResponse implements IResponse {
  private constructor(
    public readonly businessId: number,
    public readonly iban: string,
    public readonly balance: number,
  ) {}

  public static fromModel(model: BankModel): MyBusinessBankResponse {
    return new MyBusinessBankResponse(model.businessId, model.iban, model.balance);
  }
}
