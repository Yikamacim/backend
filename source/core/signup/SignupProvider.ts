import type { QueryResult } from "pg";
import type { ProviderResponse } from "../../@types/responses.d.ts";
import { DbConstants } from "../../app/constants/DbConstants.ts";
import type { IProvider } from "../../app/interfaces/IProvider.ts";
import { AccountModel } from "../../app/models/AccountModel.ts";
import { UnexpectedQueryResultError } from "../../app/schemas/ServerError.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";

export class SignupProvider implements IProvider {
  public async doesAccountExist(username: string): Promise<ProviderResponse<boolean>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(Queries.GET_ACCOUNT$UNAME, [
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
  ): Promise<ProviderResponse<AccountModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(
        Queries.CREATE_ACCOUNT$UNAME_$PSWRD,
        [username, password],
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

enum Queries {
  GET_ACCOUNT$UNAME = `SELECT * FROM "Account" WHERE "username" = $1;`,
  CREATE_ACCOUNT$UNAME_$PSWRD =
    `INSERT INTO "Account" ("username", "password") VALUES ($1, $2) RETURNING *;`,
}
