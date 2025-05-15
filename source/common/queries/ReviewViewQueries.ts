export enum ReviewViewQueries {
  GET_REVIEWS_$BSID = `SELECT * FROM "ReviewView" WHERE "businessId" = $1`,
}
