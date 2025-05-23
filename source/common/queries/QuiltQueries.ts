export enum QuiltQueries {
  INSERT_QUILT_RT_$ITID_$QLSZ_$QMAT = `INSERT INTO "Quilt" ("itemId", "quiltSize", "quiltMaterial") VALUES ($1, $2::"QuiltSize", $3::"QuiltMaterial") RETURNING *`,
  UPDATE_QUILT_RT_$QLID_$QLSZ_$QMAT = `UPDATE "Quilt" SET "quiltSize" = $2::"QuiltSize", "quiltMaterial" = $3::"QuiltMaterial" WHERE "quiltId" = $1 RETURNING *`,
}
