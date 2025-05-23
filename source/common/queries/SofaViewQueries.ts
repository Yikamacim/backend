export enum SofaViewQueries {
  GET_SOFAS_$ACID_$ISDEL = `SELECT * FROM "SofaView" WHERE "accountId" = $1 AND "isDeleted" = $2`,

  GET_SOFA_$SFID_$ISDEL = `SELECT * FROM "SofaView" WHERE "sofaId" = $1 AND "isDeleted" = $2`,
  GET_SOFA_$ACID_$SFID_$ISDEL = `SELECT * FROM "SofaView" WHERE "accountId" = $1 AND "sofaId" = $2 AND "isDeleted" = $3`,
}
