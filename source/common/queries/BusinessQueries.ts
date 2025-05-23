export enum BusinessQueries {
  INSERT_BUSINESS_RT_$ACID_$NAME_$ADID_$PHONE_$EMAIL_$DESC = `INSERT INTO "Business" ("accountId", "name", "addressId", "phone", "email", "description") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
  UPDATE_BUSINESS_RT_$BSID_$NAME_$ADID_$PHONE_$EMAIL_$DESC = `UPDATE "Business" SET "name" = $2, "addressId" = $3, "phone" = $4, "email" = $5, "description" = $6 WHERE "businessId" = $1 RETURNING *`,
  UPDATE_BUSINESS_$BSID_$ISOP = `UPDATE "Business" SET "isOpen" = $2 WHERE "businessId" = $1`,
}
