export enum BusinessAreaQueries {
  INSERT_BUSINESS_AREA_$BSID_$NBID = `INSERT INTO "BusinessArea" ("businessId", "neighborhoodId") VALUES ($1, $2)`,
  DELETE_BUSINESS_AREA_$BSID_$NBID = `DELETE FROM "BusinessArea" WHERE "businessId" = $1 AND "neighborhoodId" = $2`,
}
