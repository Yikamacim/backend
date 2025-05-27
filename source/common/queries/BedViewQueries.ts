export enum BedViewQueries {
  GET_BEDS_$ACID_$ISDEL = `SELECT * FROM "BedView" WHERE "accountId" = $1 AND "isDeleted" = $2`,

  GET_BED_$ITID = `SELECT * FROM "BedView" WHERE "itemId" = $1`,
  GET_BED_$ACID_$BDID = `SELECT * FROM "BedView" WHERE "accountId" = $1 AND "bedId" = $2`,
  GET_BED_$BDID_$ISDEL = `SELECT * FROM "BedView" WHERE "bedId" = $1 AND "isDeleted" = $2`,
  GET_BED_$ACID_$BDID_$ISDEL = `SELECT * FROM "BedView" WHERE "accountId" = $1 AND "bedId" = $2 AND "isDeleted" = $3`,
}
