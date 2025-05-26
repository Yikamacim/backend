import type { ManagerResponse } from "../../@types/responses";
import type { Either } from "../../app/concepts/Either";
import { Left } from "../../app/concepts/Left";
import { Right } from "../../app/concepts/Right";
import type { IHelper } from "../../app/interfaces/IHelper";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import type { EBedSize } from "../enums/EBedSize";
import type { EBlanketMaterial } from "../enums/EBlanketMaterial";
import type { EBlanketSize } from "../enums/EBlanketSize";
import type { ECarpetMaterial } from "../enums/ECarpetMaterial";
import type { ECurtainType } from "../enums/ECurtainType";
import type { EMediaType } from "../enums/EMediaType";
import type { EQuiltMaterial } from "../enums/EQuiltMaterial";
import type { EQuiltSize } from "../enums/EQuiltSize";
import { EServiceCategory } from "../enums/EServiceCategory";
import type { ESofaType } from "../enums/ESofaType";
import type { EVehicleType } from "../enums/EVehicleType";
import type { OrderItemModel } from "../models/OrderItemModel";
import { BedProvider } from "../providers/BedProvider";
import { BlanketProvider } from "../providers/BlanketProvider";
import { CarpetProvider } from "../providers/CarpetProvider";
import { ChairProvider } from "../providers/ChairProvider";
import { CurtainProvider } from "../providers/CurtainProvider";
import { ItemMediaProvider } from "../providers/ItemMediaProvider";
import { OrderItemProvider } from "../providers/OrderItemProvider";
import { MediaHelper } from "./MediaHelper";

export class OrderHelper implements IHelper {
  public static async getOrderItems(
    orderId: number,
    serviceCategory: EServiceCategory,
  ): Promise<
    Either<
      ManagerResponse<null>,
      | {
          readonly bedId: number;
          readonly name: string;
          readonly description: string;
          readonly medias: {
            readonly mediaId: number;
            readonly mediaType: EMediaType;
            readonly extension: string;
            readonly url: string;
          }[];
          readonly bedSize: EBedSize | null;
        }[]
      | {
          readonly blanketId: number;
          readonly name: string;
          readonly description: string;
          readonly medias: {
            readonly mediaId: number;
            readonly mediaType: EMediaType;
            readonly extension: string;
            readonly url: string;
          }[];
          readonly blanketSize: EBlanketSize | null;
          readonly blanketMaterial: EBlanketMaterial | null;
        }[]
      | {
          readonly carpetId: number;
          readonly name: string;
          readonly description: string;
          readonly medias: {
            readonly mediaId: number;
            readonly mediaType: EMediaType;
            readonly extension: string;
            readonly url: string;
          }[];
          readonly width: number | null;
          readonly length: number | null;
          readonly carpetMaterial: ECarpetMaterial | null;
        }[]
      | {
          readonly chairId: number;
          readonly name: string;
          readonly description: string;
          readonly medias: {
            readonly mediaId: number;
            readonly mediaType: EMediaType;
            readonly extension: string;
            readonly url: string;
          }[];
          readonly quantity: number;
        }[]
      | {
          readonly curtainId: number;
          readonly name: string;
          readonly description: string;
          readonly medias: {
            readonly mediaId: number;
            readonly mediaType: EMediaType;
            readonly extension: string;
            readonly url: string;
          }[];
          readonly width: number | null;
          readonly length: number | null;
          readonly curtainType: ECurtainType | null;
        }[]
      | {
          readonly quiltId: number;
          readonly name: string;
          readonly description: string;
          readonly medias: {
            readonly mediaId: number;
            readonly mediaType: EMediaType;
            readonly extension: string;
            readonly url: string;
          }[];
          readonly quiltSize: EQuiltSize | null;
          readonly quiltMaterial: EQuiltMaterial | null;
        }[]
      | {
          readonly sofaId: number;
          readonly name: string;
          readonly description: string;
          readonly medias: {
            readonly mediaId: number;
            readonly mediaType: EMediaType;
            readonly extension: string;
            readonly url: string;
          }[];
          readonly isCushioned: boolean | null;
          readonly sofaType: ESofaType | null;
          readonly sofaMaterial: string | null;
        }[]
      | {
          readonly vehicleId: number;
          readonly name: string;
          readonly description: string;
          readonly medias: {
            readonly mediaId: number;
            readonly mediaType: EMediaType;
            readonly extension: string;
            readonly url: string;
          }[];
          readonly brand: string | null;
          readonly model: string | null;
          readonly vehicleType: EVehicleType | null;
        }[]
    >
  > {
    const orderItems = await new OrderItemProvider().getOrderItems(orderId);
    switch (serviceCategory) {
      case EServiceCategory.BED_CLEANING: {
        const beds = await OrderHelper.getBeds(orderItems);
        if (beds.isLeft()) {
          return Left.of(beds.get());
        }
        return Right.of(beds.get());
      }
      case EServiceCategory.BLANKET_CLEANING: {
        const blankets = await OrderHelper.getBlankets(orderItems);
        if (blankets.isLeft()) {
          return Left.of(blankets.get());
        }
        return Right.of(blankets.get());
      }
      case EServiceCategory.CARPET_CLEANING: {
        const carpets = await OrderHelper.getCarpets(orderItems);
        if (carpets.isLeft()) {
          return Left.of(carpets.get());
        }
        return Right.of(carpets.get());
      }
      case EServiceCategory.CHAIR_CLEANING: {
        const chairs = await OrderHelper.getChairs(orderItems);
        if (chairs.isLeft()) {
          return Left.of(chairs.get());
        }
        return Right.of(chairs.get());
      }
      case EServiceCategory.CURTAIN_CLEANING: {
        const curtains = await OrderHelper.getCurtains(orderItems);
        if (curtains.isLeft()) {
          return Left.of(curtains.get());
        }
        return Right.of(curtains.get());
      }
      case EServiceCategory.QUILT_CLEANING: {
        const quilts = await OrderHelper.getQuilts(orderItems);
        if (quilts.isLeft()) {
          return Left.of(quilts.get());
        }
        return Right.of(quilts.get());
      }
      case EServiceCategory.SOFA_CLEANING: {
        const sofas = await OrderHelper.getSofas(orderItems);
        if (sofas.isLeft()) {
          return Left.of(sofas.get());
        }
        return Right.of(sofas.get());
      }
      case EServiceCategory.VEHICLE_CLEANING: {
        const vehicles = await OrderHelper.getVehicles(orderItems);
        if (vehicles.isLeft()) {
          return Left.of(vehicles.get());
        }
        return Right.of(vehicles.get());
      }
    }
  }

  private static async getBeds(orderItems: OrderItemModel[]): Promise<
    Either<
      ManagerResponse<null>,
      {
        readonly bedId: number;
        readonly name: string;
        readonly description: string;
        readonly medias: {
          readonly mediaId: number;
          readonly mediaType: EMediaType;
          readonly extension: string;
          readonly url: string;
        }[];
        readonly bedSize: EBedSize | null;
      }[]
    >
  > {
    const beds = [];
    for (const orderItem of orderItems) {
      const bed = await new BedProvider().getBed(orderItem.itemId);
      if (bed === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.BED_NOT_FOUND)],
            null,
          ),
        );
      }
      const medias = await new ItemMediaProvider().getItemMedias(bed.itemId);
      const mediaEntites = await MediaHelper.mediasToEntities(medias);
      beds.push({
        bedId: bed.bedId,
        name: bed.name,
        description: bed.description,
        medias: mediaEntites,
        bedSize: bed.bedSize,
      });
    }
    return Right.of(beds);
  }

  private static async getBlankets(orderItems: OrderItemModel[]): Promise<
    Either<
      ManagerResponse<null>,
      {
        readonly blanketId: number;
        readonly name: string;
        readonly description: string;
        readonly medias: {
          readonly mediaId: number;
          readonly mediaType: EMediaType;
          readonly extension: string;
          readonly url: string;
        }[];
        readonly blanketSize: EBlanketSize | null;
        readonly blanketMaterial: EBlanketMaterial | null;
      }[]
    >
  > {
    const blankets = [];
    for (const orderItem of orderItems) {
      const blanket = await new BlanketProvider().getBlanket(orderItem.itemId);
      if (blanket === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.BLANKET_NOT_FOUND)],
            null,
          ),
        );
      }
      const medias = await new ItemMediaProvider().getItemMedias(blanket.itemId);
      const mediaEntites = await MediaHelper.mediasToEntities(medias);
      blankets.push({
        blanketId: blanket.blanketId,
        name: blanket.name,
        description: blanket.description,
        medias: mediaEntites,
        blanketSize: blanket.blanketSize,
        blanketMaterial: blanket.blanketMaterial,
      });
    }
    return Right.of(blankets);
  }

  private static async getCarpets(orderItems: OrderItemModel[]): Promise<
    Either<
      ManagerResponse<null>,
      {
        readonly carpetId: number;
        readonly name: string;
        readonly description: string;
        readonly medias: {
          readonly mediaId: number;
          readonly mediaType: EMediaType;
          readonly extension: string;
          readonly url: string;
        }[];
        readonly width: number | null;
        readonly length: number | null;
        readonly carpetMaterial: ECarpetMaterial | null;
      }[]
    >
  > {
    const carpets = [];
    for (const orderItem of orderItems) {
      const carpet = await new CarpetProvider().getCarpet(orderItem.itemId);
      if (carpet === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.CARPET_NOT_FOUND)],
            null,
          ),
        );
      }
      const medias = await new ItemMediaProvider().getItemMedias(carpet.itemId);
      const mediaEntites = await MediaHelper.mediasToEntities(medias);
      carpets.push({
        carpetId: carpet.carpetId,
        name: carpet.name,
        description: carpet.description,
        medias: mediaEntites,
        width: carpet.width,
        length: carpet.length,
        carpetMaterial: carpet.carpetMaterial,
      });
    }
    return Right.of(carpets);
  }

  private static async getChairs(orderItems: OrderItemModel[]): Promise<
    Either<
      ManagerResponse<null>,
      {
        readonly chairId: number;
        readonly name: string;
        readonly description: string;
        readonly medias: {
          readonly mediaId: number;
          readonly mediaType: EMediaType;
          readonly extension: string;
          readonly url: string;
        }[];
        readonly quantity: number;
      }[]
    >
  > {
    const chairs = [];
    for (const orderItem of orderItems) {
      const chair = await new ChairProvider().getChair(orderItem.itemId);
      if (chair === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.CHAIR_NOT_FOUND)],
            null,
          ),
        );
      }
      const medias = await new ItemMediaProvider().getItemMedias(chair.itemId);
      const mediaEntites = await MediaHelper.mediasToEntities(medias);
      chairs.push({
        chairId: chair.chairId,
        name: chair.name,
        description: chair.description,
        medias: mediaEntites,
        quantity: chair.quantity,
      });
    }
    return Right.of(chairs);
  }

  private static async getCurtains(orderItems: OrderItemModel[]): Promise<
    Either<
      ManagerResponse<null>,
      {
        readonly curtainId: number;
        readonly name: string;
        readonly description: string;
        readonly medias: {
          readonly mediaId: number;
          readonly mediaType: EMediaType;
          readonly extension: string;
          readonly url: string;
        }[];
        readonly width: number | null;
        readonly length: number | null;
        readonly curtainType: ECurtainType | null;
      }[]
    >
  > {
    const curtains = [];
    for (const orderItem of orderItems) {
      const curtain = await new CurtainProvider().getCurtain(orderItem.itemId);
      if (curtain === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.CURTAIN_NOT_FOUND)],
            null,
          ),
        );
      }
      const medias = await new ItemMediaProvider().getItemMedias(curtain.itemId);
      const mediaEntites = await MediaHelper.mediasToEntities(medias);
      curtains.push({
        curtainId: curtain.curtainId,
        name: curtain.name,
        description: curtain.description,
        medias: mediaEntites,
        width: curtain.width,
        length: curtain.length,
        curtainType: curtain.curtainType,
      });
    }
    return Right.of(curtains);
  }
}
