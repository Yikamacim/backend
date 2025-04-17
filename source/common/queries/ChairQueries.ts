export enum ChairQueries {
  INSERT_CHAIR_RT_$ITID_$QTTY = `INSERT INTO "Chair" ("itemId", "quantity") VALUES ($1, $2) RETURNING *`,
  UPDATE_CHAIR_RT_$CHID_$QTTY = `UPDATE "Chair" SET "quantity" = $2 WHERE "chairId" = $1 RETURNING *`,
  DELETE_CHAIR_$CHID = `DELETE FROM "Chair" WHERE "chairId" = $1`,
}
