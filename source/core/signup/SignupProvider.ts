import type { QueryResult } from "pg";
import type { ProviderResponse } from "../../@types/responses.d.ts";
import { DbConstants } from "../../app/constants/DbConstants.ts";
import type { AccountType } from "../../app/enums/AccountType.ts";
import type { IProvider } from "../../app/interfaces/IProvider.ts";
import { UnexpectedQueryResultError } from "../../app/schemas/ServerError.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";
import { AccountModel } from "../../common/models/AccountModel.ts";
import { AccountQueries } from "../../common/queries/AccountQueries.ts";

export class SignupProvider implements IProvider {
  public async doesAccountExist(username: string): Promise<ProviderResponse<boolean>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(AccountQueries.GET_ACCOUNT_$UNAME, [
        username,
      ]);
      const record: unknown = results.rows[0];
      if (!record) {
        return await ResponseUtil.providerResponse(false);
      }
      return await ResponseUtil.providerResponse(AccountModel.fromRecord(record) ? true : false);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
  
  public async createAccount(
    username: string,
    password: string,
    accountType: AccountType,
  ): Promise<ProviderResponse<AccountModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(
        AccountQueries.CREATE_ACCOUNT_RT_$UNAME_$PSWRD_$ACTP,
        [username, password, accountType],
      );
      const record: unknown = results.rows[0];
      if (!record) {
        throw new UnexpectedQueryResultError();
      }
      return await ResponseUtil.providerResponse(AccountModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
