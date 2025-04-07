export enum DistrictQueries {
  GET_DISTRICTS_$PVID = `SELECT * FROM "District" WHERE "provinceId" = $1`,

  GET_DISTRICT_$DSID = `SELECT * FROM "District" WHERE "districtId" = $1`,
}
