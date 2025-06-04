export enum ReviewViewQueries {
  GET_REVIEWS_$BSID = `SELECT * FROM "ReviewView" WHERE "businessId" = $1`,

  GET_REVIEW_$RVID = `SELECT * FROM "ReviewView" WHERE "reviewId" = $1`,
  GET_REVIEW_$ORID = `SELECT * FROM "ReviewView" WHERE "orderId" = $1`,
  GET_REVIEW_$BSID_$RVID = `SELECT * FROM "ReviewView" WHERE "businessId" = $1 AND "reviewId" = $2`,
}
