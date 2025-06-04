export enum ReplyQueries {
  INSERT_REPLY_$RVID_$MSG = `INSERT INTO "Reply" ("reviewId", "message") VALUES ($1, $2)`,
}
