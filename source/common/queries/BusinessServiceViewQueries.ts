export enum BusinessServiceViewQueries {
  SEARCH_BUSINESSES_$BSIDS_$QUERY = `SELECT * FROM "BusinessServiceView" WHERE "businessId" = ANY($1) AND ("name" ILIKE '%' || $2 || '%' OR "serviceTitle" ILIKE '%' || $2 || '%') AND "isDeleted" = false`,
}
