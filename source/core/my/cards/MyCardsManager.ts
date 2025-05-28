import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { CardEntity } from "../../../common/entities/CardEntity";
import { MyCardsProvider } from "./MyCardsProvider";
import type { MyCardsParams } from "./schemas/MyCardsParams";
import type { MyCardsRequest } from "./schemas/MyCardsRequest";
import { MyCardsResponse } from "./schemas/MyCardsResponse";

export class MyCardsManager implements IManager {
  public constructor(private readonly provider = new MyCardsProvider()) {}

  public async getMyCards(payload: TokenPayload): Promise<ManagerResponse<MyCardsResponse[]>> {
    const cards = await this.provider.getMyActiveCards(payload.accountId);
    const entities = cards.map((card) => new CardEntity(card));
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyCardsResponse.fromEntities(entities),
    );
  }

  public async postMyCards(
    payload: TokenPayload,
    request: MyCardsRequest,
  ): Promise<ManagerResponse<MyCardsResponse>> {
    if (request.isDefault) {
      await this.provider.clearMyDefaultCards(payload.accountId);
    }
    const card = await this.provider.createMyCard(
      payload.accountId,
      request.name,
      request.owner,
      request.number,
      request.expirationMonth,
      request.expirationYear,
      request.cvv,
      request.isDefault,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyCardsResponse.fromEntity(new CardEntity(card)),
    );
  }

  public async getMyCards$(
    payload: TokenPayload,
    params: MyCardsParams,
  ): Promise<ManagerResponse<MyCardsResponse | null>> {
    const card = await this.provider.getMyActiveCard(payload.accountId, parseInt(params.cardId));
    if (card === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CARD_WITH_THIS_ID)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyCardsResponse.fromEntity(new CardEntity(card)),
    );
  }

  public async putMyCards$(
    payload: TokenPayload,
    params: MyCardsParams,
    request: MyCardsRequest,
  ): Promise<ManagerResponse<MyCardsResponse | null>> {
    const card = await this.provider.getMyActiveCard(payload.accountId, parseInt(params.cardId));
    if (card === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CARD_WITH_THIS_ID)],
        null,
      );
    }
    if (request.isDefault) {
      await this.provider.clearMyDefaultCards(payload.accountId);
    }
    const updatedCard = await this.provider.updateCard(
      card.cardId,
      request.name,
      request.owner,
      request.number,
      request.expirationMonth,
      request.expirationYear,
      request.cvv,
      request.isDefault,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyCardsResponse.fromEntity(new CardEntity(updatedCard)),
    );
  }

  public async deleteMyCards$(
    payload: TokenPayload,
    params: MyCardsParams,
  ): Promise<ManagerResponse<null>> {
    const card = await this.provider.getMyActiveCard(payload.accountId, parseInt(params.cardId));
    if (card === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CARD_WITH_THIS_ID)],
        null,
      );
    }
    if (card.isDefault) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.CANNOT_DELETE_DEFAULT_CARD)],
        null,
      );
    }
    await this.provider.archiveCard(card.cardId);
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
