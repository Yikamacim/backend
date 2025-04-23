export enum BusinessMediaViewQueries {
  GET_BUSINESS_MEDIAS_$BSID_$ISMN = `SELECT * FROM "BusinessMediaView" WHERE "businessId" = $1 AND "isMain" = $2`,

  GET_BUSINESS_MEDIA_$BSID_$MDID = `SELECT * FROM "BusinessMediaView" WHERE "businessId" = $1 AND "mediaId" = $2`,
}
