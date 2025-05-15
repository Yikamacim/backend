export enum BusinessViewQueries {
  GET_BUSINESS_$BSID = `SELECT * FROM "BusinessView" WHERE "businessId" = $1`,
  GET_BUSINESS_$ACID = `SELECT * FROM "BusinessView" WHERE "accountId" = $1`,
}
