export enum AccountQueries {
  GET_ACCOUNT_$ACID = `SELECT * FROM "Account" WHERE "accountId" = $1`,
  GET_ACCOUNT_$PHONE = `SELECT * FROM "Account" WHERE "phone" = $1`,
  INSERT_ACCOUNT_RT_$PHONE_$PSWRD_$NAME_$SNAME_$ATYP_$ISVF = `INSERT INTO "Account" ("phone", "password", "name", "surname", "accountType", "isVerified") VALUES ($1, $2, $3, $4, $5::"AccountType", $6) RETURNING *`,
  UPDATE_ACCOUNT_$ACID_$ISVF = `UPDATE "Account" SET "isVerified" = $2 WHERE "accountId" = $1`,
}
