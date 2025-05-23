import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IRequest } from "../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { CardCvvValidator } from "../../../../common/validators/CardCvvValidator";
import { CardExpirationMonthValidator } from "../../../../common/validators/CardExpirationMonthValidator";
import { CardExpirationYearValidator } from "../../../../common/validators/CardExpirationYearValidator";
import { CardNameValidator } from "../../../../common/validators/CardNameValidator";
import { CardNumberValidator } from "../../../../common/validators/CardNumberValidator";
import { CardOwnerValidator } from "../../../../common/validators/CardOwnerValidator";

export class MyCardsRequest implements IRequest {
  public constructor(
    public readonly name: string,
    public readonly owner: string,
    public readonly number: string,
    public readonly expirationMonth: number,
    public readonly expirationYear: number,
    public readonly cvv: string,
    public readonly isDefault: boolean,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyCardsRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyCardsRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyCardsRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    CardNameValidator.validate(blueprintData.name, clientErrors);
    CardOwnerValidator.validate(blueprintData.owner, clientErrors);
    CardNumberValidator.validate(blueprintData.number, clientErrors);
    CardExpirationMonthValidator.validate(blueprintData.expirationMonth, clientErrors);
    CardExpirationYearValidator.validate(blueprintData.expirationYear, clientErrors);
    CardCvvValidator.validate(blueprintData.cvv, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyCardsRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyCardsRequest;
    return (
      typeof blueprint.name === "string" &&
      typeof blueprint.owner === "string" &&
      typeof blueprint.number === "string" &&
      typeof blueprint.expirationMonth === "number" &&
      typeof blueprint.expirationYear === "number" &&
      typeof blueprint.cvv === "string" &&
      typeof blueprint.isDefault === "boolean"
    );
  }
}
