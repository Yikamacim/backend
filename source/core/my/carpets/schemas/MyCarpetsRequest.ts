import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IRequest } from "../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { CarpetMaterial } from "../../../../common/enums/CarpetMaterial";
import { ItemDescriptionValidator } from "../../../../common/validators/ItemDescriptionValidator";
import { ItemNameValidator } from "../../../../common/validators/ItemNameValidator";
import { MediaIdsValidator } from "../../../../common/validators/MediaIdsValidator";

export class MyCarpetsRequest implements IRequest {
  public constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly mediaIds: number[],
    public readonly width: number | null,
    public readonly length: number | null,
    public readonly carpetMaterial: CarpetMaterial | null,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyCarpetsRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyCarpetsRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyCarpetsRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    ItemNameValidator.validate(blueprintData.name, clientErrors);
    ItemDescriptionValidator.validate(blueprintData.description, clientErrors);
    MediaIdsValidator.validate(blueprintData.mediaIds, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyCarpetsRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyCarpetsRequest;
    return (
      typeof blueprint.name === "string" &&
      typeof blueprint.description === "string" &&
      Array.isArray(blueprint.mediaIds) &&
      blueprint.mediaIds.every((mediaId) => typeof mediaId === "number") &&
      (blueprint.width === null || typeof blueprint.width === "number") &&
      (blueprint.length === null || typeof blueprint.length === "number") &&
      (blueprint.carpetMaterial === null ||
        Object.values(CarpetMaterial).includes(blueprint.carpetMaterial))
    );
  }
}
