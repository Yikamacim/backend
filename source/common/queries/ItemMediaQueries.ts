export enum ItemMediaQueries {
  INSERT_ITEM_MEDIA_$ITID_$MDID = `INSERT INTO "ItemMedia" ("itemId", "mediaId") VALUES ($1, $2) RETURNING *`,
}
