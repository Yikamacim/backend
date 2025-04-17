export enum QuiltViewQueries {
  GET_QUILTS_$ACID = `SELECT * FROM "QuiltView" WHERE "accountId" = $1`,

  GET_QUILT_$ACID_$QLID = `SELECT * FROM "QuiltView" WHERE "accountId" = $1 AND "quiltId" = $2`,
}
