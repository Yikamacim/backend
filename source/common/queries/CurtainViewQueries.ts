export enum CurtainViewQueries {
  GET_CURTAINS_$ACID_$ISDEL = `SELECT * FROM "CurtainView" WHERE "accountId" = $1 AND "isDeleted" = $2`,

  GET_CURTAIN_$ITID = `SELECT * FROM "CurtainView" WHERE "itemId" = $1`,
  GET_CURTAIN_$ACID_$CRID = `SELECT * FROM "CurtainView" WHERE "accountId" = $1 AND "curtainId" = $2`,
  GET_CURTAIN_$CRID_$ISDEL = `SELECT * FROM "CurtainView" WHERE "curtainId" = $1 AND "isDeleted" = $2`,
  GET_CURTAIN_$ACID_$CRID_$ISDEL = `SELECT * FROM "CurtainView" WHERE "accountId" = $1 AND "curtainId" = $2 AND "isDeleted" = $3`,
}
