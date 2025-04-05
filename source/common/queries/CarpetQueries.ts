export enum CarpetQueries {
  INSERT_CARPET_$ITID_$WIDTH_$LENGTH_$CMAT = `INSERT INTO "Carpet" ("itemId", "width", "length", "carpetMaterial") VALUES ($1, $2, $3, $4) RETURNING *`,
}
