import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IRequest } from "../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { AddressNameValidator } from "../../../../common/validators/AddressNameValidator";
import { ExplicitAddressValidator } from "../../../../common/validators/ExplicitAddressValidator";

export class MyAddressesRequest implements IRequest {
  public constructor(
    public readonly name: string,
    public readonly countryId: number,
    public readonly provinceId: number,
    public readonly districtId: number,
    public readonly neighborhoodId: number,
    public readonly explicitAddress: string,
    public readonly isDefault: boolean,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyAddressesRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyAddressesRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyAddressesRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    AddressNameValidator.validate(blueprintData.name, clientErrors);
    ExplicitAddressValidator.validate(blueprintData.explicitAddress, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyAddressesRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyAddressesRequest;
    return (
      typeof blueprint.name === "string" &&
      typeof blueprint.countryId === "number" &&
      typeof blueprint.provinceId === "number" &&
      typeof blueprint.districtId === "number" &&
      typeof blueprint.neighborhoodId === "number" &&
      typeof blueprint.explicitAddress === "string" &&
      typeof blueprint.isDefault === "boolean"
    );
  }
}
