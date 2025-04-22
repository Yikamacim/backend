export enum BankQueries {
  GET_BANK_$BSID = `SELECT * FROM "Bank" WHERE "businessId" = $1`,
  INSERT_BANK_$BSID_$OWNER_$IBAN = `INSERT INTO "Bank" ("businessId", "owner", "iban") VALUES ($1, $2, $3) RETURNING *`,
  UPDATE_BANK_$BSID_$OWNER_$IBAN_$BLCH = `UPDATE "Bank" SET "owner" = $2, "iban" = $3, "balance" = "balance" + $4 WHERE "businessId" = $1 RETURNING *`,
}
