export enum BusinessAreaViewQueries {
  GET_BUSINESS_AREAS_$BSID = `SELECT * FROM "BusinessAreaView" WHERE "businessId" = $1`,

  GET_BUSINESS_AREA_$BSID_$NBID = `SELECT * FROM "BusinessAreaView" WHERE "businessId" = $1 AND "neighborhoodId" = $2`,
}
