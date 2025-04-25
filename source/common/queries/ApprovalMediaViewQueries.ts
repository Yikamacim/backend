export enum ApprovalMediaViewQueries {
  GET_APPROVAL_MEDIAS_$BSID = `SELECT * FROM "ApprovalMediaView" WHERE "businessId" = $1`,
}
