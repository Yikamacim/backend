import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { SearchEntity } from "../../common/entities/SearchEntity";
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
    const entities: SearchEntity[] = [];
    for (const business of businesses) {
      if (business.mediaId === null) {
        entities.push(new SearchEntity(business, null));
        continue;
      }
      const media = await this.provider.getBusinessMedia(business.businessId, business.mediaId);
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.HAS_NO_MEDIA_WITH_ID)],
          null,
        );
      }
      const mediaEntity = await MediaHelper.mediaToEntity(media);
      entities.push(new SearchEntity(business, mediaEntity));
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      SearchResponse.fromEntities(entities),
    );
  }
}
