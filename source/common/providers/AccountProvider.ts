import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AccountModel } from "../../common/models/AccountModel";
import { AccountQueries } from "../../common/queries/AccountQueries";

export class AccountProvider implements IProvider {
  public async getAccountById(accountId: number): Promise<ProviderResponse<AccountModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(AccountQueries.GET_ACCOUNT_$ACID, [accountId]);
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

  public async getAccountByUsername(
    username: string,
  ): Promise<ProviderResponse<AccountModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(AccountQueries.GET_ACCOUNT_$UNAME, [username]);
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
