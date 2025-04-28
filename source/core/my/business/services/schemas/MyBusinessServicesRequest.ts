import type { ParserResponse } from "../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../@types/wrappers";
import type { IRequest } from "../../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { ServiceCategory } from "../../../../../common/enums/ServiceCategory";
import { ServiceDescriptionValidator } from "../../../../../common/validators/ServiceDescriptionValidator";
import { ServiceTitleValidator } from "../../../../../common/validators/ServiceTitleValidator";
import { ServiceUnitPriceValidator } from "../../../../../common/validators/ServiceUnitPriceValidator";

export class MyBusinessServicesRequest implements IRequest {
  public constructor(
    public readonly title: string,
    public readonly mediaId: number | null,
    public readonly serviceCategory: ServiceCategory,
    public readonly description: string,
    public readonly unitPrice: number,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyBusinessServicesRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyBusinessServicesRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyBusinessServicesRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    ServiceTitleValidator.validate(blueprintData.title, clientErrors);
    ServiceDescriptionValidator.validate(blueprintData.description, clientErrors);
    ServiceUnitPriceValidator.validate(blueprintData.unitPrice, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyBusinessServicesRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyBusinessServicesRequest;
    return (
      typeof blueprint.title === "string" &&
      (blueprint.mediaId === null || typeof blueprint.mediaId === "number") &&
      Object.values(ServiceCategory).includes(blueprint.serviceCategory) &&
      typeof blueprint.description === "string" &&
      typeof blueprint.unitPrice === "number"
    );
  }
}
