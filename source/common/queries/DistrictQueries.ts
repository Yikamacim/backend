export enum DistrictQueries {
  GET_DISTRICT_$DSID = `SELECT * FROM "District" WHERE "districtId" = $1`,
  GET_DISTRICTS_$PVID = `SELECT * FROM "District" WHERE "provinceId" = $1`,
}
