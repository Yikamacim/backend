export enum SofaViewQueries {
  GET_SOFAS_$ACID = `SELECT * FROM "SofaView" WHERE "accountId" = $1`,

  GET_SOFA_$ACID_$SFID = `SELECT * FROM "SofaView" WHERE "accountId" = $1 AND "sofaId" = $2`,
}
