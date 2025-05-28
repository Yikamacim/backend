export enum MessageQueries {
  GET_MESSAGES_$ORID = `SELECT * FROM "Message" WHERE "orderId" = $1 ORDER BY "sentAt" ASC`,

  INSERT_MESSAGE_$ORID_$FRBS_$CONT = `INSERT INTO "Message" ("orderId", "fromBusiness", "content") VALUES ($1, $2, $3)`,
}
