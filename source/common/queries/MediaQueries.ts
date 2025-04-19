export enum MediaQueries {
  DELETE_MEDIAS_$ISUS_$EXPR = `DELETE FROM "Media" WHERE "mediaId" IN (SELECT "mediaId" FROM "MediaView" WHERE "isUsed" = $1 AND "createdAt" < NOW() - INTERVAL '1 hour' * $2)`,

  INSERT_MEDIA_RT_$ACID_$MTYP_$EXTN = `INSERT INTO "Media" ("accountId", "mediaType", "extension") VALUES ($1, $2::"MediaType", $3) RETURNING *`,
}
