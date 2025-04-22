export enum HoursQueries {
  GET_HOURS_$BSID = `SELECT * FROM "Hours" WHERE "businessId" = $1`,
  INSERT_HOURS_$BSID_$MONF_$MONT_$TUEF_$TUET_$WEDF_$WEDT_$THUF_$THUT_$FRIF_$FRIT_$SATF_$SATT_$SUNF_$SUNT = `INSERT INTO "Hours" ("businessId", "mondayFrom", "mondayTo", "tuesdayFrom", "tuesdayTo", "wednesdayFrom", "wednesdayTo", "thursdayFrom", "thursdayTo", "fridayFrom", "fridayTo", "saturdayFrom", "saturdayTo", "sundayFrom", "sundayTo") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
  UPDATE_HOURS_$BSID_$MONF_$MONT_$TUEF_$TUET_$WEDF_$WEDT_$THUF_$THUT_$FRIF_$FRIT_$SATF_$SATT_$SUNF_$SUNT = `UPDATE "Hours" SET "mondayFrom" = $2, "mondayTo" = $3, "tuesdayFrom" = $4, "tuesdayTo" = $5, "wednesdayFrom" = $6, "wednesdayTo" = $7, "thursdayFrom" = $8, "thursdayTo" = $9, "fridayFrom" = $10, "fridayTo" = $11, "saturdayFrom" = $12, "saturdayTo" = $13, "sundayFrom" = $14, "sundayTo" = $15 WHERE "businessId" = $1 RETURNING *`,
}
