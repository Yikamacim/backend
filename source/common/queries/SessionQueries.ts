export enum SessionQueries {
  GET_SESSION_$SSID = `SELECT * FROM "Session" WHERE "sessionId" = $1`,
  GET_SESSION_$ACID_$SSID = `SELECT * FROM "Session" WHERE "accountId" = $1 AND "sessionId" = $2`,
  GET_SESSIONS_$ACID = `SELECT * FROM "Session" WHERE "accountId" = $1`,
  INSERT_SESSION_RT_$ACID_$DVNM_$SKEY = `INSERT INTO "Session" ("accountId", "deviceName", "sessionKey") VALUES ($1, $2, $3) RETURNING *`,
  UPDATE_SESSION_$SSID_$DVNM_$RTOKEN = `UPDATE "Session" SET "deviceName" = $2, "refreshToken" = $3, "lastActivityDate" = NOW() WHERE "sessionId" = $1`,
  DELETE_SESSION_$SSID = `DELETE FROM "Session" WHERE "sessionId" = $1`,
}
