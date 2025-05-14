import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IQueries } from "../../../app/interfaces/IQueries";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ArrayUtil } from "../../../app/utils/ArrayUtil";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../app/utils/StringUtil";
import { ServiceCategory } from "../../../common/enums/ServiceCategory";
import { SearchQueryValidator } from "../../../common/validators/SearchQueryValidator";

export class SearchQueries implements IQueries {
  private constructor(
    public readonly query: string,
    public readonly neighborhoodId: string,
    public readonly serviceCategory: ServiceCategory[],
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<SearchQueries | null> {
    const query = req.query["query"];
    const neighborhoodId = req.query["neighborhoodId"];
    const serviceCategory = req.query["serviceCategory"] ?? [];
    // >----------< EXISTENCE VALIDATION >----------<
    if (
      !ProtoUtil.isProtovalid(query) ||
      !ProtoUtil.isProtovalid(neighborhoodId) ||
      !ProtoUtil.isProtovalid(serviceCategory)
    ) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_QUERY)], null);
    }
    const protovalidData: unknown = {
      query: query,
      neighborhoodId: neighborhoodId,
      serviceCategory: Array.isArray(serviceCategory) ? serviceCategory : [serviceCategory],
    };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!SearchQueries.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_QUERY)], null);
    }
    const blueprintData: SearchQueries = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    SearchQueryValidator.validate(blueprintData.query, clientErrors);
    if (!StringUtil.isIntParsable(blueprintData.neighborhoodId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_NEIGHBORHOOD_ID));
    }
    if (ArrayUtil.hasDuplicates(blueprintData.serviceCategory)) {
      clientErrors.push(new ClientError(ClientErrorCode.DUPLICATE_SERVICE_CATEGORIES));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is SearchQueries {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as SearchQueries;
    return (
      typeof blueprint.query === "string" &&
      typeof blueprint.neighborhoodId === "string" &&
      blueprint.serviceCategory.every((category) =>
        Object.values(ServiceCategory).includes(category),
      )
    );
  }
}
