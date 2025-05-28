import type { IResponse } from "../../../../../../app/interfaces/IResponse";
import type { MessageEntity } from "../../../../../../common/entities/MessageEntity";

export class MyBusinessOrdersMessagesResponse implements IResponse {
  private constructor(
    public readonly messageId: number,
    public readonly orderId: number,
    public readonly fromBusiness: boolean,
    public readonly content: string,
    public readonly sentAt: Date,
  ) {}

  public static fromEntity(entity: MessageEntity): MyBusinessOrdersMessagesResponse {
    return new MyBusinessOrdersMessagesResponse(
      entity.model.messageId,
      entity.model.orderId,
      entity.model.fromBusiness,
      entity.model.content,
      entity.model.sentAt,
    );
  }

  public static fromEntities(entities: MessageEntity[]): MyBusinessOrdersMessagesResponse[] {
    return entities.map((entity) => MyBusinessOrdersMessagesResponse.fromEntity(entity));
  }
}
