export enum AccountQueries {
  GET_ACCOUNT_$ACID = `SELECT * FROM "Account" WHERE "accountId" = $1`,
  GET_ACCOUNT_$PHONE = `SELECT * FROM "Account" WHERE "phone" = $1;`,
  INSERT_ACCOUNT_RT_$PHONE_$PSWRD_$NAME_$SNAME_$ACTP = `INSERT INTO "Account" ("phone", "password", "name", "surname", "accountType") VALUES ($1, $2, $3, $4, $5::"AccountType") RETURNING *;`,
  INSERT_ACCOUNT_VERIFIED_RT_$PHONE_$PSWRD_$NAME_$SNAME_$ACTP = `INSERT INTO "Account" ("phone", "password", "name", "surname", "accountType", "isVerified") VALUES ($1, $2, $3, $4, $5::"AccountType", true) RETURNING *;`,
  VERIFY_ACCOUNT_RT_$ACID = `UPDATE "Account" SET "isVerified" = true WHERE "accountId" = $1 RETURNING *;`,
}
