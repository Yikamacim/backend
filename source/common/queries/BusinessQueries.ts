export enum BusinessQueries {
  INSERT_BUSINESS_RT_$ACID_$NAME_$ADID_$PHONE_$EMAIL_$DESC = `INSERT INTO "Business" ("accountId", "name", "addressId", "phone", "email", "description") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
}
