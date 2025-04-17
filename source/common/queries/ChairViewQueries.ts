export enum ChairViewQueries {
  GET_CHAIRS_$ACID = `SELECT * FROM "ChairView" WHERE "accountId" = $1`,

  GET_CHAIR_$ACID_$SFID = `SELECT * FROM "ChairView" WHERE "accountId" = $1 AND "chairId" = $2`,
}
