export enum ItemMediaQueries {
  INSERT_ITEM_MEDIA_$ITID_$MDID = `INSERT INTO "ItemMedia" ("itemId", "mediaId") VALUES ($1, $2)`,
  DELETE_ITEM_MEDIA_$ITID_$MDID = `DELETE FROM "ItemMedia" WHERE "itemId" = $1 AND "mediaId" = $2`,
}
