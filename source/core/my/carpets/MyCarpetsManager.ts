import type { MediaData } from "../../../@types/medias";
import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaModel } from "../../../common/models/MediaModel";
import { BucketModule } from "../../../modules/bucket/module";
import { MyCarpetsProvider } from "./MyCarpetsProvider";
import type { MyCarpetsRequest } from "./schemas/MyCarpetsRequest";
import { MyCarpetsResponse } from "./schemas/MyCarpetsResponse";

export class MyCarpetsManager implements IManager {
  public constructor(private readonly provider = new MyCarpetsProvider()) {}

  public async getMyCarpets(accountId: number): Promise<ManagerResponse<MyCarpetsResponse[]>> {
    // Get my carpets
    const prGetMyCarpets = await this.provider.getMyCarpets(accountId);
    // Get media data for each carpet
    const responses: MyCarpetsResponse[] = [];
    for (const carpet of prGetMyCarpets.data) {
      // Get media ids
      const prGetItemMedias = await this.provider.getItemMedias(carpet.itemId);
      // For each media, get media data
      const mediaData: MediaData[] = [];
      for (const media of prGetItemMedias.data) {
        mediaData.push({
          mediaId: media.mediaId,
          mediaType: media.mediaType,
          extension: media.extension,
          url: await BucketModule.instance.getAccessUrl(
            `${media.mediaId.toString()}.${media.extension}`,
          ),
        });
      }
      // Push to response
      responses.push(MyCarpetsResponse.fromModel(carpet, mediaData));
    }
    // Return my carpets
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyCarpets(
    accountId: number,
    validatedData: MyCarpetsRequest,
  ): Promise<ManagerResponse<MyCarpetsResponse | null>> {
    // Get my medias
    const prGetMyMedias = await this.provider.getMyMedias(accountId);
    // Check if medias exist in database
    const medias: MediaModel[] = [];
    for (const mediaId of validatedData.mediaIds) {
      const media = prGetMyMedias.data.find((media) => media.mediaId === mediaId);
      if (!media) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
          null,
        );
      }
      medias.push(media);
    }
    // Check if medias uploaded to bucket
    for (const media of medias) {
      const mediaExists = await BucketModule.instance.checkFileExists(
        `${media.mediaId.toString()}.${media.extension}`,
      );
      if (!mediaExists) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_UPLOADED)],
          null,
        );
      }
    }
    // Create my carpet
    const prCreateCarpet = await this.provider.createCarpet(
      accountId,
      validatedData.name,
      validatedData.description,
      validatedData.mediaIds,
      validatedData.width,
      validatedData.length,
      validatedData.carpetMaterial,
    );
    // Create media data
    const mediaData: MediaData[] = [];
    for (const media of medias) {
      mediaData.push({
        mediaId: media.mediaId,
        mediaType: media.mediaType,
        extension: media.extension,
        url: await BucketModule.instance.getAccessUrl(
          `${media.mediaId.toString()}.${media.extension}`,
        ),
      });
    }
    // Return my carpet
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyCarpetsResponse.fromModel(prCreateCarpet.data, mediaData),
    );
  }

  public async getMyCarpets$carpetId(
    accountId: number,
    carpetId: number,
  ): Promise<ManagerResponse<MyCarpetsResponse | null>> {
    // Try to get my carpet
    const prGetMyCarpet = await this.provider.getMyCarpet(accountId, carpetId);
    // Check if carpet exists
    if (prGetMyCarpet.data === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CARPET_NOT_FOUND)],
        null,
      );
    }
    // Get media ids
    const prGetItemMedias = await this.provider.getItemMedias(prGetMyCarpet.data.itemId);
    // Get media data for my carpet
    const mediaData: MediaData[] = [];
    for (const media of prGetItemMedias.data) {
      mediaData.push({
        mediaId: media.mediaId,
        mediaType: media.mediaType,
        extension: media.extension,
        url: await BucketModule.instance.getAccessUrl(
          `${media.mediaId.toString()}.${media.extension}`,
        ),
      });
    }
    // Return my carpet
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyCarpetsResponse.fromModel(prGetMyCarpet.data, mediaData),
    );
  }
}
