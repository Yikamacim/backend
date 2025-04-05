export enum CarpetViewQueries {
  GET_CARPETS_$ACID = `SELECT * FROM "CarpetView" WHERE "accountId" = $1`,
  GET_CARPET_$ACID_$CPID = `SELECT * FROM "CarpetView" WHERE "accountId" = $1 AND "carpetId" = $2`,
}
