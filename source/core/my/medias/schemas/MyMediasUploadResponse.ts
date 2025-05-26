import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { UploadEntity } from "../../../../common/entities/UploadEntity";

export class MyMediasUploadResponse implements IResponse {
  private constructor(
    public readonly mediaId: number,
    public readonly url: string,
    public readonly fields: Record<string, string>,
  ) {}

  public static fromEntity(entity: UploadEntity): MyMediasUploadResponse {
    return new MyMediasUploadResponse(
      entity.mediaId,
      entity.uploadUrl.url,
      entity.uploadUrl.fields,
    );
  }

  public static fromEntities(entities: UploadEntity[]): MyMediasUploadResponse[] {
    return entities.map((entity) => MyMediasUploadResponse.fromEntity(entity));
  }
}
