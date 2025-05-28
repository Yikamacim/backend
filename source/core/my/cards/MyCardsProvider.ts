import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { CardModel } from "../../../common/models/CardModel";
import { CardProvider } from "../../../common/providers/CardProvider";
import { CardQueries } from "../../../common/queries/CardQueries";

export class MyCardsProvider implements IProvider {
  public constructor(private readonly cardProvider = new CardProvider()) {
    this.getMyActiveCards = this.cardProvider.getMyActiveCards.bind(this.cardProvider);
    this.getMyActiveCard = this.cardProvider.getMyActiveCard.bind(this.cardProvider);
  }

  public getMyActiveCards: typeof this.cardProvider.getMyActiveCards;
  public getMyActiveCard: typeof this.cardProvider.getMyActiveCard;

  public async createMyCard(
    accountId: number,
    name: string,
    owner: string,
    number: string,
    expirationMonth: number,
    expirationYear: number,
    cvv: string,
    isDefault: boolean,
  ): Promise<ProviderResponse<CardModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        CardQueries.INSERT_CARD_RT_$ACID_$NAME_$OWNER_$NUMBER_$EXMN_$EXYR_$CVV_$ISDF,
        [accountId, name, owner, number, expirationMonth, expirationYear, cvv, isDefault],
      );
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        throw new UnexpectedDatabaseStateError("Card was not created");
      }
      return CardModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateCard(
    cardId: number,
    name: string,
    owner: string,
    number: string,
    expirationMonth: number,
    expirationYear: number,
    cvv: string,
    isDefault: boolean,
  ): Promise<ProviderResponse<CardModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        CardQueries.UPDATE_CARD_RT_$CAID_$NAME_$OWNER_$NUMBER_$EXMN_$EXYR_$CVV_$ISDF,
        [cardId, name, owner, number, expirationMonth, expirationYear, cvv, isDefault],
      );
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        throw new UnexpectedDatabaseStateError("Card was not created");
      }
      return CardModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async clearMyDefaultCards(accountId: number): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(CardQueries.UPDATE_CARDS_$ACID_$ISDF, [accountId, false]);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async archiveCard(cardId: number): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(CardQueries.UPDATE_ADDRESS_$CAID_$ISDEL, [cardId, true]);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
