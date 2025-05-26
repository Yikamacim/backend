import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { CardEntity } from "../../../../common/entities/CardEntity";

export class MyCardsResponse implements IResponse {
  private constructor(
    public readonly cardId: number,
    public readonly name: string,
    public readonly owner: string,
    public readonly number: string,
    public readonly expirationMonth: number,
    public readonly expirationYear: number,
    public readonly cvv: string,
    public readonly isDefault: boolean,
  ) {}

  public static fromEntity(entity: CardEntity): MyCardsResponse {
    return new MyCardsResponse(
      entity.model.cardId,
      entity.model.name,
      entity.model.owner,
      entity.model.number,
      entity.model.expirationMonth,
      entity.model.expirationYear,
      entity.model.cvv,
      entity.model.isDefault,
    );
  }

  public static fromEntities(entities: CardEntity[]): MyCardsResponse[] {
    return entities.map((entity) => MyCardsResponse.fromEntity(entity));
  }
}
