export enum QuiltViewQueries {
  GET_QUILTS_$ACID_$ISDEL = `SELECT * FROM "QuiltView" WHERE "accountId" = $1 AND "isDeleted" = $2`,

  GET_QUILT_$ITID = `SELECT * FROM "QuiltView" WHERE "itemId" = $1`,
  GET_QUILT_$ACID_$QLID = `SELECT * FROM "QuiltView" WHERE "accountId" = $1 AND "quiltId" = $2`,
  GET_QUILT_$QLID_$ISDEL = `SELECT * FROM "QuiltView" WHERE "quiltId" = $1 AND "isDeleted" = $2`,
  GET_QUILT_$ACID_$QLID_$ISDEL = `SELECT * FROM "QuiltView" WHERE "accountId" = $1 AND "quiltId" = $2 AND "isDeleted" = $3`,
}
