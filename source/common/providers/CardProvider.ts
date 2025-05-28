import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { CardModel } from "../models/CardModel";
import { CardQueries } from "../queries/CardQueries";

export class CardProvider implements IProvider {
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
}
