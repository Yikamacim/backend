export enum NeighborhoodQueries {
  GET_NEIGHBORHOODS_$DSID = `SELECT * FROM "Neighborhood" WHERE "districtId" = $1`,

  GET_NEIGHBORHOOD_$NBID = `SELECT * FROM "Neighborhood" WHERE "neighborhoodId" = $1`,
}
