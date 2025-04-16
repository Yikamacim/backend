export enum BedViewQueries {
  GET_BEDS_$ACID = `SELECT * FROM "BedView" WHERE "accountId" = $1`,

  GET_BED_$ACID_$BDID = `SELECT * FROM "BedView" WHERE "accountId" = $1 AND "bedId" = $2`,
}
