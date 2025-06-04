export enum ReviewQueries {
  INSERT_REVIEW_RT_$ACID_$BSID_$ORID_$STARS_$CMNT = `INSERT INTO "Review" ("accountId", "businessId", "orderId", "stars", "comment") VALUES ($1, $2, $3, $4, $5) RETURNING *`,
}
