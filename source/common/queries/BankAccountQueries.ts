export enum BankAccountQueries {
  GET_BANK_ACCOUNT_$BSID = `SELECT * FROM "BankAccount" WHERE "businessId" = $1`,
  INSERT_BANK_ACCOUNT_$BSID_$OWNER_$IBAN = `INSERT INTO "BankAccount" ("businessId", "owner", "iban") VALUES ($1, $2, $3) RETURNING *`,
  UPDATE_BANK_ACCOUNT_$BSID_$OWNER_$IBAN_$BLCH = `UPDATE "BankAccount" SET "owner" = $2, "iban" = $3, "balance" = "balance" + $4 WHERE "businessId" = $1 RETURNING *`,
}
