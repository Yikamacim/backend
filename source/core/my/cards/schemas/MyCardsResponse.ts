import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { CardModel } from "../../../../common/models/CardModel";

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

  public static fromModel(model: CardModel): MyCardsResponse {
    return new MyCardsResponse(
      model.cardId,
      model.name,
      model.owner,
      model.number,
      model.expirationMonth,
      model.expirationYear,
      model.cvv,
      model.isDefault,
    );
  }

  public static fromModels(models: CardModel[]): MyCardsResponse[] {
    return models.map((model: CardModel) => MyCardsResponse.fromModel(model));
  }
}
