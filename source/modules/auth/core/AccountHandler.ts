import type { QueryResult } from "pg";
import type { TokenPayload } from "../../../@types/tokens.d.ts";
import { DbConstants } from "../../../app/constants/DbConstants.ts";
import { AccountModel } from "../../../common/models/AccountModel.ts";
import { AccountQueries } from "../../../common/queries/AccountQueries.ts";
import type { HandlerResponse } from "../@types/responses.d.ts";
import type { IHandler } from "../app/interfaces/IHandler.ts";
import { AuthResponseUtil } from "../app/utils/AuthResponseUtil.ts";

export class AccountHandler implements IHandler {
  public static async verifyAccount(tokenPayload: TokenPayload): Promise<HandlerResponse<boolean>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(AccountQueries.GET_ACCOUNT_$ACID, [
        tokenPayload.accountId,
      ]);
      const record: unknown = results.rows[0];
      if (!record) {
        return await AuthResponseUtil.handlerResponse(false);
      }
      const model: AccountModel = AccountModel.fromRecord(record);
      return await AuthResponseUtil.handlerResponse(model ? true : false);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
