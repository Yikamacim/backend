export enum ApprovalQueries {
  GET_APPROVALS_$STATE = `SELECT * FROM "Approval" WHERE "approvalState" = $1::"ApprovalState" ORDER BY "createdAt" ASC`,

  GET_APPROVAL_$BSID = `SELECT * FROM "Approval" WHERE "businessId" = $1`,
  INSERT_APPROVAL_$BSID_$MSG = `INSERT INTO "Approval" ("businessId", "message") VALUES ($1, $2) RETURNING *`,
  UPDATE_APPROVAL_$BSID_$STATE_$REASON = `UPDATE "Approval" SET "approvalState" = $1::"ApprovalState", "reason" = $2 WHERE "businessId" = $3 RETURNING *`,
  DELETE_APPROVAL_$BSID = `DELETE FROM "Approval" WHERE "businessId" = $1`,
}
