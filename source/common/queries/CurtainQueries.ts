export enum CurtainQueries {
  INSERT_CURTAIN_RT_$ITID_$WIDTH_$LENGTH_$CTYP_$CMAT = `INSERT INTO "Curtain" ("itemId", "width", "length", "curtainType", "curtainMaterial") VALUES ($1, $2, $3, $4::"CurtainType", $5::"CurtainMaterial") RETURNING *`,
  UPDATE_CURTAIN_RT_$CPID_$WIDTH_$LENGTH_$CTYP_$CMAT = `UPDATE "Curtain" SET "width" = $2, "length" = $3, "curtainType" = $4::"CurtainType", "curtainMaterial" = $5::"CurtainMaterial" WHERE "curtainId" = $1 RETURNING *`,
  DELETE_CURTAIN_$CRID = `DELETE FROM "Curtain" WHERE "curtainId" = $1`,
}
