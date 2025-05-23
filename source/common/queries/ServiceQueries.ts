export enum ServiceQueries {
  GET_SERVICES_$BSID_$ISDEL = `SELECT * FROM "Service" WHERE "businessId" = $1 AND "isDeleted" = $2`,

  GET_SERVICE_$BSID_$SVID = `SELECT * FROM "Service" WHERE "businessId" = $1 AND "serviceId" = $2`,
  INSERT_SERVICE_$BSID_$TITLE_$MDID_$SCAT_$DESC_$UPRICE = `INSERT INTO "Service" ("businessId", "title", "mediaId", "serviceCategory", "description", "unitPrice") VALUES ($1, $2, $3, $4::"ServiceCategory", $5, $6) RETURNING *`,
  UPDATE_SERVICE_$SVID_$TITLE_$MDID_$SCAT_$DESC_$UPRICE = `UPDATE "Service" SET "title" = $2, "mediaId" = $3, "serviceCategory" = $4::"ServiceCategory", "description" = $5, "unitPrice" = $6 WHERE "serviceId" = $1 RETURNING *`,
  UPDATE_SERVICE_$SVID_$ISDEL = `UPDATE "Service" SET "isDeleted" = $2 WHERE "serviceId" = $1`,
}
