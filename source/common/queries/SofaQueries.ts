export enum SofaQueries {
  INSERT_SOFA_RT_$ITID_$ISCH_$SFTP_$SMAT = `INSERT INTO "Sofa" ("itemId", "isCushioned", "sofaType", "sofaMaterial") VALUES ($1, $2, $3::"SofaType", $4::"SofaMaterial") RETURNING *`,
  UPDATE_SOFA_RT_$SFID_$ISCH_$SFTP_$SMAT = `UPDATE "Sofa" SET "isCushioned" = $2, "sofaType" = $3::"SofaType", "sofaMaterial" = $4::"SofaMaterial" WHERE "sofaId" = $1 RETURNING *`,
}
