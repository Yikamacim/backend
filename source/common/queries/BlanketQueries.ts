export enum BlanketQueries {
  INSERT_BLANKET_RT_$ITID_$QLSZ_$QMAT = `INSERT INTO "Blanket" ("itemId", "blanketSize", "blanketMaterial") VALUES ($1, $2::"BlanketSize", $3::"BlanketMaterial") RETURNING *`,
  UPDATE_BLANKET_RT_$BLID_$BLSZ_$BMAT = `UPDATE "Blanket" SET "blanketSize" = $2::"BlanketSize", "blanketMaterial" = $3::"BlanketMaterial" WHERE "blanketId" = $1 RETURNING *`,
  DELETE_BLANKET_$BLID = `DELETE FROM "Blanket" WHERE "blanketId" = $1`,
}
