export enum ApprovalMediaQueries {
  DELETE_APPROVAL_MEDIAS_$BSID = `DELETE FROM "ApprovalMedia" WHERE "businessId" = $1`,

  INSERT_APPROVAL_MEDIA_$BSID_$MDID = `INSERT INTO "ApprovalMedia" ("businessId", "mediaId") VALUES ($1, $2)`,
}
