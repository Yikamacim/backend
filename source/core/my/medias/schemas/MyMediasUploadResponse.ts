import type { IResponse } from "../../../../app/interfaces/IResponse";

export class MyMediasUploadResponse implements IResponse {
  private constructor(public readonly mediaUrl: string) {}

  public static fromModel(mediaUrl: string): MyMediasUploadResponse {
    return new MyMediasUploadResponse(mediaUrl);
  }
}
