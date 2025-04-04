import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import { MediaType } from "../../../../app/enums/MediaType";
import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";

export class MyMediasUploadParams implements IParams {
  private constructor(public readonly mediaType: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyMediasUploadParams | null> {
    const preliminaryData: unknown = req.params["mediaType"];
    // V1: Existence validation
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { mediaType: preliminaryData };
    // V2: Schematic validation
    if (!MyMediasUploadParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: MyMediasUploadParams = protovalidData;
    // V3: Physical validation
    const clientErrors: ClientError[] = [];
    if (!Object.values(MediaType).includes(blueprintData.mediaType.toUpperCase() as MediaType)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_MEDIA_TYPE));
    }
    const validatedData = blueprintData;
    // Return parser response
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is MyMediasUploadParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MyMediasUploadParams;
    return typeof blueprint.mediaType === "string";
  }
}
