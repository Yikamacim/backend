export enum CarpetViewQueries {
  GET_CARPETS_$ACID_$ISDEL = `SELECT * FROM "CarpetView" WHERE "accountId" = $1 AND "isDeleted" = $2`,

  GET_CARPET_$CPID_$ISDEL = `SELECT * FROM "CarpetView" WHERE "carpetId" = $1 AND "isDeleted" = $2`,
  GET_CARPET_$ACID_$CPID_$ISDEL = `SELECT * FROM "CarpetView" WHERE "accountId" = $1 AND "carpetId" = $2 AND "isDeleted" = $3`,
}
