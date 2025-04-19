export enum MediaViewQueries {
  GET_MEDIAS = `SELECT * FROM "MediaView"`,
  GET_MEDIAS_$ACID_$ISUS = `SELECT * FROM "MediaView" WHERE "accountId" = $1 AND "isUsed" = $2`,
}
