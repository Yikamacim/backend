import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import type { AccountType } from "../../common/enums/AccountType";
import { AccountModel } from "../../common/models/AccountModel";
import { AccountProvider } from "../../common/providers/AccountProvider";
import { AccountQueries } from "../../common/queries/AccountQueries";

export class SignupProvider implements IProvider {
  public constructor(private readonly accountProvider = new AccountProvider()) {
    this.getAccount = this.accountProvider.getAccountByPhone.bind(this.accountProvider);
  }

  public getAccount: typeof this.accountProvider.getAccountByPhone;

  public async createAccount(
    phone: string,
    password: string,
    name: string,
    surname: string,
    accountType: AccountType,
  ): Promise<ProviderResponse<AccountModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      // WHAT IS THIS SHIT
      if (phone === "+905331991562") {
        const results = await DbConstants.POOL.query(
          AccountQueries.INSERT_ACCOUNT_RT_$PHONE_$PSWRD_$NAME_$SNAME_$ATYP_$ISVF,
          [phone, password, name, surname, accountType, false],
        );
        const record: unknown = results.rows[0];
        return await ResponseUtil.providerResponse(AccountModel.fromRecord(record));
      } else {
        const results = await DbConstants.POOL.query(
          AccountQueries.INSERT_ACCOUNT_RT_$PHONE_$PSWRD_$NAME_$SNAME_$ATYP_$ISVF,
          [phone, password, name, surname, accountType, true],
        );
        const record: unknown = results.rows[0];
        return await ResponseUtil.providerResponse(AccountModel.fromRecord(record));
      }
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
