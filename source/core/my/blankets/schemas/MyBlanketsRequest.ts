import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IRequest } from "../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { BlanketMaterial } from "../../../../common/enums/BlanketMaterial";
import { BlanketSize } from "../../../../common/enums/BlanketSize";
import { ItemDescriptionValidator } from "../../../../common/validators/ItemDescriptionValidator";
import { ItemNameValidator } from "../../../../common/validators/ItemNameValidator";
import { MediaIdsValidator } from "../../../../common/validators/MediaIdsValidator";

export class MyBlanketsRequest implements IRequest {
  public constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly mediaIds: number[],
    public readonly blanketSize: BlanketSize | null,
    public readonly blanketMaterial: BlanketMaterial | null,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyBlanketsRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyBlanketsRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyBlanketsRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    ItemNameValidator.validate(blueprintData.name, clientErrors);
    ItemDescriptionValidator.validate(blueprintData.description, clientErrors);
    MediaIdsValidator.validate(blueprintData.mediaIds, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyBlanketsRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyBlanketsRequest;
    return (
      typeof blueprint.name === "string" &&
      typeof blueprint.description === "string" &&
      Array.isArray(blueprint.mediaIds) &&
      blueprint.mediaIds.every((mediaId: unknown): boolean => typeof mediaId === "number") &&
      (blueprint.blanketSize === null ||
        Object.values(BlanketSize).includes(blueprint.blanketSize)) &&
      (blueprint.blanketMaterial === null ||
        Object.values(BlanketMaterial).includes(blueprint.blanketMaterial))
    );
  }
}
