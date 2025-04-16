export enum CurtainQueries {
  INSERT_CURTAIN_RT_$ITID_$WIDTH_$LENGTH_$CTYP = `INSERT INTO "Curtain" ("itemId", "width", "length", "curtainType") VALUES ($1, $2, $3, $4::"CurtainType") RETURNING *`,
  UPDATE_CURTAIN_RT_$CPID_$WIDTH_$LENGTH_$CTYP = `UPDATE "Curtain" SET "width" = $2, "length" = $3, "curtainType" = $4::"CurtainType" WHERE "curtainId" = $1 RETURNING *`,
  DELETE_CURTAIN_$CRID = `DELETE FROM "Curtain" WHERE "curtainId" = $1`,
}
