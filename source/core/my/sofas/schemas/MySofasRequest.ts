import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IRequest } from "../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { ESofaMaterial } from "../../../../common/enums/ESofaMaterial";
import { ESofaType } from "../../../../common/enums/ESofaType";
import { ItemDescriptionValidator } from "../../../../common/validators/ItemDescriptionValidator";
import { ItemNameValidator } from "../../../../common/validators/ItemNameValidator";
import { MediaIdsValidator } from "../../../../common/validators/MediaIdsValidator";

export class MySofasRequest implements IRequest {
  public constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly mediaIds: number[],
    public readonly isCushioned: boolean | null,
    public readonly sofaType: ESofaType | null,
    public readonly sofaMaterial: ESofaMaterial | null,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MySofasRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MySofasRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MySofasRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    ItemNameValidator.validate(blueprintData.name, clientErrors);
    ItemDescriptionValidator.validate(blueprintData.description, clientErrors);
    MediaIdsValidator.validate(blueprintData.mediaIds, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MySofasRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MySofasRequest;
    return (
      typeof blueprint.name === "string" &&
      typeof blueprint.description === "string" &&
      Array.isArray(blueprint.mediaIds) &&
      blueprint.mediaIds.every((mediaId) => typeof mediaId === "number") &&
      (blueprint.isCushioned === null || typeof blueprint.isCushioned === "boolean") &&
      (blueprint.sofaType === null || Object.values(ESofaType).includes(blueprint.sofaType)) &&
      (blueprint.sofaMaterial === null ||
        Object.values(ESofaMaterial).includes(blueprint.sofaMaterial))
    );
  }
}
