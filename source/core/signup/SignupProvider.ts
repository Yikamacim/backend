import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { AccountType } from "../../app/enums/AccountType";
import type { IProvider } from "../../app/interfaces/IProvider";
import { UnexpectedQueryResultError } from "../../app/schemas/ServerError";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AccountModel } from "../../common/models/AccountModel";
import { AccountProvider } from "../../common/providers/AccountProvider";
import { AccountQueries } from "../../common/queries/AccountQueries";

export class SignupProvider implements IProvider {
  public constructor(private readonly accountProvider = new AccountProvider()) {
    this.getAccount = this.accountProvider.getAccountByUsername.bind(this.accountProvider);
  }

  public getAccount: typeof this.accountProvider.getAccountByUsername;

  public async createAccount(
    username: string,
    password: string,
    accountType: AccountType,
  ): Promise<ProviderResponse<AccountModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        AccountQueries.INSERT_ACCOUNT_RT_$UNAME_$PSWRD_$ACTP,
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
