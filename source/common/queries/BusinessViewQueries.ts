export enum BusinessViewQueries {
  GET_TOP_BUSINESSES_$BSIDS_$LIMIT = `SELECT * FROM "BusinessView" WHERE "businessId" = ANY($1) ORDER BY "stars" DESC LIMIT $2`,

  GET_BUSINESS_$BSID = `SELECT * FROM "BusinessView" WHERE "businessId" = $1`,
  GET_BUSINESS_$ACID = `SELECT * FROM "BusinessView" WHERE "accountId" = $1`,
}
