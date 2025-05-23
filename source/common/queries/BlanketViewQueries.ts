export enum BlanketViewQueries {
  GET_BLANKETS_$ACID_$ISDEL = `SELECT * FROM "BlanketView" WHERE "accountId" = $1 AND "isDeleted" = $2`,

  GET_BLANKET_$BLID_$ISDEL = `SELECT * FROM "BlanketView" WHERE "blanketId" = $1 AND "isDeleted" = $2`,
  GET_BLANKET_$ACID_$BLID_$ISDEL = `SELECT * FROM "BlanketView" WHERE "accountId" = $1 AND "blanketId" = $2 AND "isDeleted" = $3`,
}
