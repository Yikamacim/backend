export enum CampaignAreaViewQueries {
  GET_CAMPAIGN_AREAS_$NBID = `SELECT * FROM "CampaignAreaView" WHERE "neighborhoodId" = $1`,
}
