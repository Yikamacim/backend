export enum CampaignQueries {
  GET_CAMPAIGNS_$BSID = `SELECT * FROM "Campaign" WHERE "businessId" = $1`,

  GET_CAMPAIGN_$BSID_$CMID = `SELECT * FROM "Campaign" WHERE "businessId" = $1 AND "campaignId" = $2`,
  INSERT_CAMPAIGN_RT_$BSID_$TITLE_$MDID_$DESC = `INSERT INTO "Campaign" ("businessId", "title", "mediaId", "description") VALUES ($1, $2, $3, $4) RETURNING *`,
  DELETE_CAMPAIGN_$CMID = `DELETE FROM "Campaign" WHERE "campaignId" = $1`,
}
