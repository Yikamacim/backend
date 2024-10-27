import type { QueryResult } from "pg";
import type { ProviderResponse } from "../../@types/responses.d.ts";
import { DbConstants } from "../../app/constants/DbConstants.ts";
import type { IProvider } from "../../app/interfaces/IProvider.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";
import { AccountModel } from "../../common/models/AccountModel.ts";
import { AccountQueries } from "../../common/queries/AccountQueries.ts";

export class AccountsProvider implements IProvider {
  public async getAccount(username: string): Promise<ProviderResponse<AccountModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(AccountQueries.GET_ACCOUNT_$UNAME, [
        username,
      ]);
      const record: unknown = results.rows[0];
      if (!record) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(AccountModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
