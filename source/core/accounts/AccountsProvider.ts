import type { QueryResult } from "pg";
import type { ProviderResponse } from "../../@types/responses.d.ts";
import { DbConstants } from "../../app/constants/DbConstants.ts";
import type { IProvider } from "../../app/interfaces/IProvider.ts";
import { AccountModel } from "../../app/models/AccountModel.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";

export class AccountsProvider implements IProvider {
  public async getAccount(username: string): Promise<ProviderResponse<AccountModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(Queries.GET_ACCOUNT$UNAME, [
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

enum Queries {
  GET_ACCOUNT$UNAME = `SELECT * FROM "Account" WHERE "username" = $1;`,
}
