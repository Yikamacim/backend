export enum BedQueries {
  INSERT_BED_RT_$ITID_$BDTP = `INSERT INTO "Bed" ("itemId", "bedType") VALUES ($1, $2::"BedType") RETURNING *`,
  UPDATE_BED_RT_$BDID_$BDTP = `UPDATE "Bed" SET "bedType" = $2::"BedType" WHERE "bedId" = $1 RETURNING *`,
  DELETE_BED_$BDID = `DELETE FROM "Bed" WHERE "bedId" = $1`,
}
