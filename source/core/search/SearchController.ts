import type { ControllerResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { SearchQueries } from "./schemas/SearchQueries";
import type { SearchResponse } from "./schemas/SearchResponse";
import { SearchManager } from "./SearchManager";

export class SearchController implements IController {
  public constructor(private readonly manager = new SearchManager()) {}

  public async getSearch(
    req: ExpressRequest,
    res: ControllerResponse<SearchResponse[] | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const queries = SearchQueries.parse(req);
      if (queries.clientErrors.length > 0 || queries.data === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          queries.clientErrors,
          [],
          null,
        );
      }
      // >-----------< LOGIC >-----------<
      const out = await this.manager.getSearch(queries.data);
      // >-----------< RESPONSE >-----------<
      return ResponseUtil.controllerResponse(
        res,
        out.httpStatus,
        out.serverError,
        out.clientErrors,
        out.data,
        null,
        false,
      );
    } catch (error) {
      return next(error);
    }
  }
}
