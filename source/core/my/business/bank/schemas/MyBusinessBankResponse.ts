import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { BankAccountEntity } from "../../../../../common/entities/BankAccountEntity";

export class MyBusinessBankResponse implements IResponse {
  private constructor(
    public readonly owner: string,
    public readonly iban: string,
    public readonly balance: number,
  ) {}

  public static fromEntity(entity: BankAccountEntity): MyBusinessBankResponse {
    return new MyBusinessBankResponse(entity.model.owner, entity.model.iban, entity.model.balance);
  }

  public static fromEntities(entities: BankAccountEntity[]): MyBusinessBankResponse[] {
    return entities.map((entity) => MyBusinessBankResponse.fromEntity(entity));
  }
}
