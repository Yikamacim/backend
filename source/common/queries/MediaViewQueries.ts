export enum MediaViewQueries {
  GET_MEDIAS = `SELECT * FROM "MediaView"`,
  GET_MEDIAS_$ACID = `SELECT * FROM "MediaView" WHERE "accountId" = $1`,

  GET_MEDIA_$MDID = `SELECT * FROM "MediaView" WHERE "mediaId" = $1`,
}
