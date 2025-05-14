import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { MediaHelper } from "../../common/helpers/MediaHelper";
import type { SearchQueries } from "./schemas/SearchQueries";
import { SearchResponse } from "./schemas/SearchResponse";
import { SearchProvider } from "./SearchProvider";

export class SearchManager implements IManager {
  public constructor(private readonly provider = new SearchProvider()) {}

  public async getSearch(
    queries: SearchQueries,
  ): Promise<ManagerResponse<SearchResponse[] | null>> {
    let businessesAndServices = await this.provider.searchBusinesses(
      parseInt(queries.neighborhoodId),
      queries.query,
    );
    if (queries.serviceCategory.length > 0) {
      businessesAndServices = businessesAndServices.filter((businessAndService) =>
        queries.serviceCategory.includes(businessAndService.serviceCategory),
      );
    }
    const seen = new Set();
    const businesses = businessesAndServices.filter((businessAndService) => {
      if (seen.has(businessAndService.businessId)) {
        return false;
      }
      seen.add(businessAndService.businessId);
      return true;
    });
    const responses: SearchResponse[] = [];
    for (const business of businesses) {
      if (business.mediaId === null) {
        responses.push(SearchResponse.fromModel(business, null));
        continue;
      }
      const media = await this.provider.getBusinessMedia(business.businessId, business.mediaId);
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
          null,
        );
      }
      const mediaDatas = await MediaHelper.mediaToMediaData(media);
      responses.push(SearchResponse.fromModel(business, mediaDatas));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }
}
