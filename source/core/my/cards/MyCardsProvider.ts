import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { CardModel } from "../../../common/models/CardModel";
import { CardQueries } from "../../../common/queries/CardQueries";

export class MyCardsProvider implements IProvider {
  public async getMyActiveCards(accountId: number): Promise<ProviderResponse<CardModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CardQueries.GET_CARDS_$ACID_$ISDEL, [
        accountId,
        false,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(CardModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyActiveCard(
    accountId: number,
    cardId: number,
  ): Promise<ProviderResponse<CardModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CardQueries.GET_CARD_$ACID_$CAID_$ISDEL, [
        accountId,
        cardId,
        false,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(CardModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

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
