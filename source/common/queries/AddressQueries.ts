export enum AddressQueries {
  DELETE_ADDRESS_$ADID = `DELETE FROM "Address" WHERE "addressId" = $1`,
  INSERT_ADDRESS_RT_$ACID_$NAME_$CNID_$PVID_$DSID_$NBID_$EXAD_$ISDF = `INSERT INTO "Address" ("accountId", "name", "countryId", "provinceId", "districtId", "neighborhoodId", "explicitAddress", "isDefault") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
  UPDATE_ADDRESS_RT_$ADID_$NAME_$CNID_$PVID_$DSID_$NBID_$EXAD_$ISDF = `UPDATE "Address" SET "name" = $2, "countryId" = $3, "provinceId" = $4, "districtId" = $5, "neighborhoodId" = $6, "explicitAddress" = $7, "isDefault" = $8 WHERE "addressId" = $1 RETURNING *`,
  UPDATE_ADDRESSES_$ACID_$ISDF = `UPDATE "Address" SET "isDefault" = $2 WHERE "accountId" = $1`,
}
