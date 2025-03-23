export enum NeighbourhoodQueries {
  GET_NEIGHBOURHOOD_$NBID = `SELECT * FROM "Neighbourhood" WHERE "neighbourhoodId" = $1`,
  GET_NEIGHBOURHOODS_$DSID = `SELECT * FROM "Neighbourhood" WHERE "districtId" = $1`,
}
