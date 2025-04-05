export enum ItemMediaViewQueries {
  GET_ITEM_MEDIAS_$ITID = `SELECT * FROM "ItemMediaView" WHERE "itemId" = $1`,
}
