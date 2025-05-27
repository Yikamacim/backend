export enum ChairViewQueries {
  GET_CHAIRS_$ACID_$ISDEL = `SELECT * FROM "ChairView" WHERE "accountId" = $1 AND "isDeleted" = $2`,

  GET_CHAIR_$ITID = `SELECT * FROM "ChairView" WHERE "itemId" = $1`,
  GET_CHAIR_$ACID_$CHID = `SELECT * FROM "ChairView" WHERE "accountId" = $1 AND "chairId" = $2`,
  GET_CHAIR_$CHID_$ISDEL = `SELECT * FROM "ChairView" WHERE "chairId" = $1 AND "isDeleted" = $2`,
  GET_CHAIR_$ACID_$CHID_$ISDEL = `SELECT * FROM "ChairView" WHERE "accountId" = $1 AND "chairId" = $2 AND "isDeleted" = $3`,
}
