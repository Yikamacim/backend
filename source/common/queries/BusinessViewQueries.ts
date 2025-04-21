export enum BusinessViewQueries {
  GET_BUSINESS_$ACID = `SELECT * FROM "BusinessView" WHERE "accountId" = $1`,
}
