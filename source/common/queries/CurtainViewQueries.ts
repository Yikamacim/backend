export enum CurtainViewQueries {
  GET_CURTAINS_$ACID = `SELECT * FROM "CurtainView" WHERE "accountId" = $1`,

  GET_CURTAIN_$ACID_$CRID = `SELECT * FROM "CurtainView" WHERE "accountId" = $1 AND "curtainId" = $2`,
}
