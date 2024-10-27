export enum AccountQueries {
  GET_ACCOUNT_$ACID = `SELECT * FROM "Account" WHERE "accountId" = $1`,
  GET_ACCOUNT_$UNAME = `SELECT * FROM "Account" WHERE "username" = $1;`,
  CREATE_ACCOUNT_RT_$UNAME_$PSWRD_$ACTP =
    `INSERT INTO "Account" ("username", "password", "accountType") VALUES ($1, $2, $3::"AccountType") RETURNING *;`,
}
