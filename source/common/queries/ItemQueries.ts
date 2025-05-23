export enum ItemQueries {
  INSERT_ITEM_RT_$ACID_$NAME_$DESC = `INSERT INTO "Item" ("accountId", "name", "description") VALUES ($1, $2, $3) RETURNING *`,
  UPDATE_ITEM_$ITID_$NAME_$DESC = `UPDATE "Item" SET "name" = $2, "description" = $3 WHERE "itemId" = $1`,
  UPDATE_ITEM_$ITID_$ISDEL = `UPDATE "Item" SET "isDeleted" = $2 WHERE "itemId" = $1`,
}
