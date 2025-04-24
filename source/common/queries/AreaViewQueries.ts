export enum AreaViewQueries {
  SEARCH_AREA_$QUERY = `SELECT * FROM "AreaView" WHERE "area" ILIKE '%' || $1 || '%'`,
}
