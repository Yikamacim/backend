import type { ParserResponse } from "../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../@types/wrappers";
import type { IRequest } from "../../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { BusinessDescriptionValidator } from "../../../../../common/validators/BusinessDescriptionValidator";
import { BusinessNameValidator } from "../../../../../common/validators/BusinessNameValidator";
import { EmailValidator } from "../../../../../common/validators/EmailValidator";
import { PhoneValidator } from "../../../../../common/validators/PhoneValidator";

export class MyBusinessRequest implements IRequest {
  public constructor(
    public readonly name: string,
    public readonly mediaId: number | null,
    public readonly address: {
      readonly countryId: number;
      readonly provinceId: number;
      readonly districtId: number;
      readonly neighborhoodId: number;
      readonly explicitAddress: string;
    },
    public readonly phone: string,
    public readonly email: string,
    public readonly description: string,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyBusinessRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyBusinessRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyBusinessRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    BusinessNameValidator.validate(blueprintData.name, clientErrors);
    PhoneValidator.validate(blueprintData.phone, clientErrors);
    EmailValidator.validate(blueprintData.email, clientErrors);
    BusinessDescriptionValidator.validate(blueprintData.description, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyBusinessRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyBusinessRequest;
    return (
      typeof blueprint.name === "string" &&
      (blueprint.mediaId === null || typeof blueprint.mediaId === "number") &&
      typeof blueprint.address === "object" &&
      blueprint.address !== null &&
      typeof blueprint.address.countryId === "number" &&
      typeof blueprint.address.provinceId === "number" &&
      typeof blueprint.address.districtId === "number" &&
      typeof blueprint.address.neighborhoodId === "number" &&
      typeof blueprint.address.explicitAddress === "string" &&
      typeof blueprint.phone === "string" &&
      typeof blueprint.email === "string" &&
      typeof blueprint.description === "string"
    );
  }
}
