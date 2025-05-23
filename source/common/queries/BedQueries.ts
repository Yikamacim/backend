export enum BedQueries {
  INSERT_BED_RT_$ITID_$BDSZ = `INSERT INTO "Bed" ("itemId", "bedSize") VALUES ($1, $2::"BedSize") RETURNING *`,
  UPDATE_BED_RT_$BDID_$BDSZ = `UPDATE "Bed" SET "bedSize" = $2::"BedSize" WHERE "bedId" = $1 RETURNING *`,
}
