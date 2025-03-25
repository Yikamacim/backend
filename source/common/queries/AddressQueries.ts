export enum AddressQueries {
  DELETE_ADDRESS_$ADID = `DELETE FROM "Address" WHERE "addressId" = $1`,
  INSERT_ADDRESS_RT_$ACID_$ANAME_$CNID_$PVID_$DSID_$NBID_$EXAD_$ISDF = `INSERT INTO "Address" ("accountId", "name", "countryId", "provinceId", "districtId", "neighbourhoodId", "explicitAddress", "isDefault") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
  UPDATE_ADDRESS_RT_$ADID_$ANAME_$CNID_$PVID_$DSID_$NBID_$EXAD_$ISDF = `UPDATE "Address" SET "name" = $2, "countryId" = $3, "provinceId" = $4, "districtId" = $5, "neighbourhoodId" = $6, "explicitAddress" = $7, "isDefault" = $8 WHERE "addressId" = $1 RETURNING *`,
  CLEAR_DEFAULT_ADDRESSES_$ACID = `UPDATE "Address" SET "isDefault" = FALSE WHERE "accountId" = $1 AND "isDefault" = TRUE`,
}
