export enum SofaQueries {
  INSERT_SOFA_RT_$ITID_$SFTP = `INSERT INTO "Sofa" ("itemId", "sofaType") VALUES ($1, $2::"SofaType") RETURNING *`,
  UPDATE_SOFA_RT_$SFID_$SFTP = `UPDATE "Sofa" SET "sofaType" = $2::"SofaType" WHERE "sofaId" = $1 RETURNING *`,
  DELETE_SOFA_$SFID = `DELETE FROM "Sofa" WHERE "sofaId" = $1`,
}
