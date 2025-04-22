export enum BankQueries {
  GET_BANK_$BSID = `SELECT * FROM "Bank" WHERE "businessId" = $1`,
  INSERT_BANK_$BSID_$IBAN = `INSERT INTO "Bank" ("businessId", "iban") VALUES ($1, $2) RETURNING *`,
  UPDATE_BANK_$BSID_$IBAN_$BLCH = `UPDATE "Bank" SET "iban" = $2, "balance" = "balance" + $3 WHERE "businessId" = $1 RETURNING *`,
}
