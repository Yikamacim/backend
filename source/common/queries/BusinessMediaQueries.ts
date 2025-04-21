export enum BusinessMediaQueries {
  INSERT_BUSINESS_MEDIA_$BSID_$MDID_$ISMN = `INSERT INTO "BusinessMedia" ("businessId", "mediaId", "isMain") VALUES ($1, $2, $3)`,
  DELETE_BUSINESS_MEDIA_$BSID_$ISMN = `DELETE FROM "BusinessMedia" WHERE "businessId" = $1 AND "isMain" = $2`,
}
