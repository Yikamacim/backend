export enum CarpetQueries {
  INSERT_CARPET_RT_$ITID_$WIDTH_$LENGTH_$CMAT = `INSERT INTO "Carpet" ("itemId", "width", "length", "carpetMaterial") VALUES ($1, $2, $3, $4::"CarpetMaterial") RETURNING *`,
  UPDATE_CARPET_RT_$CPID_$WIDTH_$LENGTH_$CMAT = `UPDATE "Carpet" SET "width" = $2, "length" = $3, "carpetMaterial" = $4::"CarpetMaterial" WHERE "carpetId" = $1 RETURNING *`,
}
