export enum ItemQueries {
  INSERT_ITEM_$ACID_$NAME_$DESC = `INSERT INTO "Item" ("accountId", "name", "description") VALUES ($1, $2, $3) RETURNING *`,
}
