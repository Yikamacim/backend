export enum BlanketViewQueries {
  GET_BLANKETS_$ACID = `SELECT * FROM "BlanketView" WHERE "accountId" = $1`,

  GET_BLANKET_$ACID_$BLID = `SELECT * FROM "BlanketView" WHERE "accountId" = $1 AND "blanketId" = $2`,
}
