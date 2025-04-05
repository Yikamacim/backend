export enum MediaQueries {
  GET_MEDIAS_$ACID_$ISUS = `SELECT * FROM "Media" WHERE "accountId" = $1 AND "isUsed" = $2`,
  INSERT_MEDIA_RT_$ACID_$MTYP_$EXTN = `INSERT INTO "Media" ("accountId", "mediaType", "extension") VALUES ($1, $2::"MediaType", $3) RETURNING *`,
  UPDATE_MEDIA_RT_$MDID_$ISUS = `UPDATE "Media" SET "isUsed" = $2 WHERE "mediaId" = $1 RETURNING *`,
}
