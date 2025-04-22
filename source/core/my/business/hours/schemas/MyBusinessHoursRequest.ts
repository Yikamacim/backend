import type { ParserResponse } from "../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../@types/wrappers";
import type { IRequest } from "../../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { BusinessHourValidator } from "../../../../../common/validators/BusinessHourValidator";

export class MyBusinessHoursRequest implements IRequest {
  public constructor(
    public readonly mondayFrom: string | null,
    public readonly mondayTo: string | null,
    public readonly tuesdayFrom: string | null,
    public readonly tuesdayTo: string | null,
    public readonly wednesdayFrom: string | null,
    public readonly wednesdayTo: string | null,
    public readonly thursdayFrom: string | null,
    public readonly thursdayTo: string | null,
    public readonly fridayFrom: string | null,
    public readonly fridayTo: string | null,
    public readonly saturdayFrom: string | null,
    public readonly saturdayTo: string | null,
    public readonly sundayFrom: string | null,
    public readonly sundayTo: string | null,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyBusinessHoursRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyBusinessHoursRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyBusinessHoursRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (blueprintData.mondayFrom !== null) {
      BusinessHourValidator.validate(blueprintData.mondayFrom, clientErrors);
    }
    if (blueprintData.mondayTo !== null) {
      BusinessHourValidator.validate(blueprintData.mondayTo, clientErrors);
    }
    if (blueprintData.tuesdayFrom !== null) {
      BusinessHourValidator.validate(blueprintData.tuesdayFrom, clientErrors);
    }
    if (blueprintData.tuesdayTo !== null) {
      BusinessHourValidator.validate(blueprintData.tuesdayTo, clientErrors);
    }
    if (blueprintData.wednesdayFrom !== null) {
      BusinessHourValidator.validate(blueprintData.wednesdayFrom, clientErrors);
    }
    if (blueprintData.wednesdayTo !== null) {
      BusinessHourValidator.validate(blueprintData.wednesdayTo, clientErrors);
    }
    if (blueprintData.thursdayFrom !== null) {
      BusinessHourValidator.validate(blueprintData.thursdayFrom, clientErrors);
    }
    if (blueprintData.thursdayTo !== null) {
      BusinessHourValidator.validate(blueprintData.thursdayTo, clientErrors);
    }
    if (blueprintData.fridayFrom !== null) {
      BusinessHourValidator.validate(blueprintData.fridayFrom, clientErrors);
    }
    if (blueprintData.fridayTo !== null) {
      BusinessHourValidator.validate(blueprintData.fridayTo, clientErrors);
    }
    if (blueprintData.saturdayFrom !== null) {
      BusinessHourValidator.validate(blueprintData.saturdayFrom, clientErrors);
    }
    if (blueprintData.saturdayTo !== null) {
      BusinessHourValidator.validate(blueprintData.saturdayTo, clientErrors);
    }
    if (blueprintData.sundayFrom !== null) {
      BusinessHourValidator.validate(blueprintData.sundayFrom, clientErrors);
    }
    if (blueprintData.sundayTo !== null) {
      BusinessHourValidator.validate(blueprintData.sundayTo, clientErrors);
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyBusinessHoursRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyBusinessHoursRequest;
    return (
      (blueprint.mondayFrom === null || typeof blueprint.mondayFrom === "string") &&
      (blueprint.mondayTo === null || typeof blueprint.mondayTo === "string") &&
      (blueprint.tuesdayFrom === null || typeof blueprint.tuesdayFrom === "string") &&
      (blueprint.tuesdayTo === null || typeof blueprint.tuesdayTo === "string") &&
      (blueprint.wednesdayFrom === null || typeof blueprint.wednesdayFrom === "string") &&
      (blueprint.wednesdayTo === null || typeof blueprint.wednesdayTo === "string") &&
      (blueprint.thursdayFrom === null || typeof blueprint.thursdayFrom === "string") &&
      (blueprint.thursdayTo === null || typeof blueprint.thursdayTo === "string") &&
      (blueprint.fridayFrom === null || typeof blueprint.fridayFrom === "string") &&
      (blueprint.fridayTo === null || typeof blueprint.fridayTo === "string") &&
      (blueprint.saturdayFrom === null || typeof blueprint.saturdayFrom === "string") &&
      (blueprint.saturdayTo === null || typeof blueprint.saturdayTo === "string") &&
      (blueprint.sundayFrom === null || typeof blueprint.sundayFrom === "string") &&
      (blueprint.sundayTo === null || typeof blueprint.sundayTo === "string")
    );
  }
}
