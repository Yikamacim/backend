export enum MediaQueries {
  INSERT_MEDIA_RT_$ACID_$MTYP = `INSERT INTO "Media" ("accountId", "mediaType") VALUES ($1, $2::"MediaType") RETURNING *`,
}
