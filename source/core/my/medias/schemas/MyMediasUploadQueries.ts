import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IQueries } from "../../../../app/interfaces/IQueries";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";

export class MyMediasUploadQueries implements IQueries {
  private constructor(public readonly extension: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyMediasUploadQueries | null> {
    const preliminaryData: unknown = req.query["extension"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_QUERY)], null);
    }
    const protovalidData: unknown = { extension: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyMediasUploadQueries.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_QUERY)], null);
    }
    const blueprintData: MyMediasUploadQueries = protovalidData;
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse([], validatedData);
  }

  private static isBlueprint(data: unknown): data is MyMediasUploadQueries {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MyMediasUploadQueries;
    return typeof blueprint.extension === "string";
  }
}
