export enum VerificationQueries {
  GET_VERIFICATION_$PHONE = `SELECT * FROM "Verification" WHERE "phone" = $1`,
  INSERT_VERIFICATION_$PHONE_$CODE_$SENTAT = `INSERT INTO "Verification" ("phone", "code", "sentAt") VALUES ($1, $2, $3)`,
  UPDATE_VERIFICATION_$PHONE_$CODE_$SENTAT = `UPDATE "Verification" SET "code" = $2, "sentAt" = $3 WHERE "phone" = $1`,
}
