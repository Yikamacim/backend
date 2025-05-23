export enum CardQueries {
  GET_CARDS_$ACID_$ISDEL = `SELECT * FROM "Card" WHERE "accountId" = $1 AND "isDeleted" = $2`,
  UPDATE_CARDS_$ACID_$ISDF = `UPDATE "Card" SET "isDefault" = $2 WHERE "accountId" = $1`,

  GET_CARD_$CAID_$ISDEL = `SELECT * FROM "Card" WHERE "cardId" = $1 AND "isDeleted" = $2`,
  GET_CARD_$ACID_$CAID_$ISDEL = `SELECT * FROM "Card" WHERE "accountId" = $1 AND "cardId" = $2 AND "isDeleted" = $3`,
  INSERT_CARD_RT_$ACID_$NAME_$OWNER_$NUMBER_$EXMN_$EXYR_$CVV_$ISDF = `INSERT INTO "Card" ("accountId", "name", "owner", "number", "expirationMonth", "expirationYear", "cvv", "isDefault") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
  UPDATE_CARD_RT_$CAID_$NAME_$OWNER_$NUMBER_$EXMN_$EXYR_$CVV_$ISDF = `UPDATE "Card" SET "name" = $2, "owner" = $3, "number" = $4, "expirationMonth" = $5, "expirationYear" = $6, "cvv" = $7, "isDefault" = $8 WHERE "cardId" = $1 RETURNING *`,
  UPDATE_ADDRESS_$CAID_$ISDEL = `UPDATE "Card" SET "isDeleted" = $2 WHERE "cardId" = $1`,
}
