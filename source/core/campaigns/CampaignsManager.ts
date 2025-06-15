// import type { ManagerResponse } from "../../@types/responses";
// import type { IManager } from "../../app/interfaces/IManager";
// import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
// import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
// import { ResponseUtil } from "../../app/utils/ResponseUtil";
// import { CampaignEntity } from "../../common/entities/CampaignEntity";
// import { MediaHelper } from "../../common/helpers/MediaHelper";
// import { CampaignsProvider } from "./CampaignsProvider";
// import type { CampaignsParams } from "./schemas/CampaignsQueries";
// import { CampaignsResponse } from "./schemas/CampaignsResponse";

// export class CampaignsManager implements IManager {
//   public constructor(private readonly provider = new CampaignsProvider()) {}

//   public async getCampaigns(
//     params: CampaignsParams,
//   ): Promise<ManagerResponse<CampaignsResponse[] | null>> {
//     let businessesAndServices = await this.provider.campaignsBusinesses(
//       parseInt(params.neighborhoodId),
//       params.query,
//     );
//     if (params.serviceCategory.length > 0) {
//       businessesAndServices = businessesAndServices.filter((businessAndService) =>
//         params.serviceCategory.includes(businessAndService.serviceCategory),
//       );
//     }
//     const seen = new Set();
//     const businesses = businessesAndServices.filter((businessAndService) => {
//       if (seen.has(businessAndService.businessId)) {
//         return false;
//       }
//       seen.add(businessAndService.businessId);
//       return true;
//     });
//     const entities: CampaignEntity[] = [];
//     for (const business of businesses) {
//       if (business.mediaId === null) {
//         entities.push(new CampaignEntity(business, null));
//         continue;
//       }
//       const media = await this.provider.getBusinessMedia(business.businessId, business.mediaId);
//       if (media === null) {
//         return ResponseUtil.managerResponse(
//           new HttpStatus(HttpStatusCode.NOT_FOUND),
//           null,
//           [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_MEDIA_WITH_THIS_ID)],
//           null,
//         );
//       }
//       const mediaEntity = await MediaHelper.mediaToEntity(media);
//       entities.push(new CampaignEntity(business, mediaEntity));
//     }
//     return ResponseUtil.managerResponse(
//       new HttpStatus(HttpStatusCode.OK),
//       null,
//       [],
//       CampaignsResponse.fromEntities(entities),
//     );
//   }
// }
