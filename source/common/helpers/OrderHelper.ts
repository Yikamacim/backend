import type { ManagerResponse } from "../../@types/responses";
import type { Either } from "../../app/concepts/Either";
import { Left } from "../../app/concepts/Left";
import { Right } from "../../app/concepts/Right";
import type { IHelper } from "../../app/interfaces/IHelper";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import type { MediaEntity } from "../entities/MediaEntity";
import { OrderEntity } from "../entities/OrderEntity";
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
import type { OrderViewModel } from "../models/OrderViewModel";
import { BedProvider } from "../providers/BedProvider";
import { BlanketProvider } from "../providers/BlanketProvider";
import { BusinessMediaProvider } from "../providers/BusinessMediaProvider";
import { CarpetProvider } from "../providers/CarpetProvider";
import { ChairProvider } from "../providers/ChairProvider";
import { CurtainProvider } from "../providers/CurtainProvider";
import { HoursProvider } from "../providers/HoursProvider";
import { ItemMediaProvider } from "../providers/ItemMediaProvider";
import { MediaProvider } from "../providers/MediaProvider";
import { OrderItemProvider } from "../providers/OrderItemProvider";
import { QuiltProvider } from "../providers/QuiltProvider";
import { SofaProvider } from "../providers/SofaProvider";
import { VehicleProvider } from "../providers/VehicleProvider";
import { HoursHelper } from "./HoursHelper";
import { MediaHelper } from "./MediaHelper";

export class OrderHelper implements IHelper {
  public static async orderToEntity(
    order: OrderViewModel,
  ): Promise<Either<ManagerResponse<null>, OrderEntity>> {
    let serviceMediaEntity: MediaEntity | null = null;
    if (order.serviceMediaId !== null) {
      const serviceMedia = await new MediaProvider().getMedia(order.serviceMediaId);
      if (serviceMedia === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_MEDIA_WITH_THIS_ID)],
            null,
          ),
        );
      }
      serviceMediaEntity = await MediaHelper.mediaToEntity(serviceMedia);
    }
    let businessMediaEntity: MediaEntity | null = null;
    if (order.businessMediaId !== null) {
      const media = await new BusinessMediaProvider().getBusinessMedia(
        order.businessId,
        order.businessMediaId,
      );
      if (media === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_MEDIA_WITH_THIS_ID)],
            null,
          ),
        );
      }
      businessMediaEntity = await MediaHelper.mediaToEntity(media);
    }
    let hoursToday: {
      readonly from: string | null;
      readonly to: string | null;
    } | null = null;
    const hours = await new HoursProvider().getHours(order.businessId);
    if (hours !== null) {
      hoursToday = HoursHelper.getTodayHours(hours);
    }
    const itemsResult = await OrderHelper.getOrderItems(order.orderId, order.serviceCategory);
    if (itemsResult.isLeft()) {
      return Left.of(itemsResult.get());
    }
    const items = itemsResult.get();
    return Right.of(
      new OrderEntity(order, serviceMediaEntity, businessMediaEntity, hoursToday, items),
    );
  }

  public static async ordersToEntities(
    orders: OrderViewModel[],
  ): Promise<Either<ManagerResponse<null>, OrderEntity[]>> {
    const entities: OrderEntity[] = [];
    for (const order of orders) {
      const entityResult = await OrderHelper.orderToEntity(order);
      if (entityResult.isLeft()) {
        return Left.of(entityResult.get());
      }
      entities.push(entityResult.get());
    }
    return Right.of(entities);
  }

  public static async findMyOrderItems(
    accountId: number,
    orderItemIds: number[],
    serviceCategory: EServiceCategory,
  ): Promise<Either<ManagerResponse<null>, number[]>> {
    switch (serviceCategory) {
      case EServiceCategory.BED_CLEANING: {
        const itemIds: number[] = [];
        for (const bedId of orderItemIds) {
          const bed = await new BedProvider().getMyBed(accountId, bedId);
          if (bed === null) {
            return Left.of(
              ResponseUtil.managerResponse(
                new HttpStatus(HttpStatusCode.NOT_FOUND),
                null,
                [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BED_WITH_THIS_ID)],
                null,
              ),
            );
          }
          itemIds.push(bed.itemId);
        }
        return Right.of(itemIds);
      }
      case EServiceCategory.BLANKET_CLEANING: {
        const itemIds: number[] = [];
        for (const blanketId of orderItemIds) {
          const blanket = await new BlanketProvider().getMyBlanket(accountId, blanketId);
          if (blanket === null) {
            return Left.of(
              ResponseUtil.managerResponse(
                new HttpStatus(HttpStatusCode.NOT_FOUND),
                null,
                [new ClientError(ClientErrorCode.ACCOUNT_BLANKET_NOT_FOUND)],
                null,
              ),
            );
          }
          itemIds.push(blanket.itemId);
        }
        return Right.of(itemIds);
      }
      case EServiceCategory.CARPET_CLEANING: {
        const itemIds: number[] = [];
        for (const carpetId of orderItemIds) {
          const carpet = await new CarpetProvider().getMyCarpet(accountId, carpetId);
          if (carpet === null) {
            return Left.of(
              ResponseUtil.managerResponse(
                new HttpStatus(HttpStatusCode.NOT_FOUND),
                null,
                [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CARPET_WITH_THIS_ID)],
                null,
              ),
            );
          }
          itemIds.push(carpet.itemId);
        }
        return Right.of(itemIds);
      }
      case EServiceCategory.CHAIR_CLEANING: {
        const itemIds: number[] = [];
        for (const chairId of orderItemIds) {
          const chair = await new ChairProvider().getMyChair(accountId, chairId);
          if (chair === null) {
            return Left.of(
              ResponseUtil.managerResponse(
                new HttpStatus(HttpStatusCode.NOT_FOUND),
                null,
                [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CHAIR_WITH_THIS_ID)],
                null,
              ),
            );
          }
          itemIds.push(chair.itemId);
        }
        return Right.of(itemIds);
      }
      case EServiceCategory.CURTAIN_CLEANING: {
        const itemIds: number[] = [];
        for (const curtainId of orderItemIds) {
          const curtain = await new CurtainProvider().getMyCurtain(accountId, curtainId);
          if (curtain === null) {
            return Left.of(
              ResponseUtil.managerResponse(
                new HttpStatus(HttpStatusCode.NOT_FOUND),
                null,
                [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CURTAIN_WITH_THIS_ID)],
                null,
              ),
            );
          }
          itemIds.push(curtain.itemId);
        }
        return Right.of(itemIds);
      }
      case EServiceCategory.QUILT_CLEANING: {
        const itemIds: number[] = [];
        for (const quiltId of orderItemIds) {
          const quilt = await new QuiltProvider().getMyQuilt(accountId, quiltId);
          if (quilt === null) {
            return Left.of(
              ResponseUtil.managerResponse(
                new HttpStatus(HttpStatusCode.NOT_FOUND),
                null,
                [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_QUILT_WITH_THIS_ID)],
                null,
              ),
            );
          }
          itemIds.push(quilt.itemId);
        }
        return Right.of(itemIds);
      }
      case EServiceCategory.SOFA_CLEANING: {
        const itemIds: number[] = [];
        for (const sofaId of orderItemIds) {
          const sofa = await new SofaProvider().getMySofa(accountId, sofaId);
          if (sofa === null) {
            return Left.of(
              ResponseUtil.managerResponse(
                new HttpStatus(HttpStatusCode.NOT_FOUND),
                null,
                [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_SOFA_WITH_THIS_ID)],
                null,
              ),
            );
          }
          itemIds.push(sofa.itemId);
        }
        return Right.of(itemIds);
      }
      case EServiceCategory.VEHICLE_CLEANING: {
        const itemIds: number[] = [];
        for (const vehicleId of orderItemIds) {
          const vehicle = await new VehicleProvider().getMyVehicle(accountId, vehicleId);
          if (vehicle === null) {
            return Left.of(
              ResponseUtil.managerResponse(
                new HttpStatus(HttpStatusCode.NOT_FOUND),
                null,
                [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_VEHICLE_WITH_THIS_ID)],
                null,
              ),
            );
          }
          itemIds.push(vehicle.itemId);
        }
        return Right.of(itemIds);
      }
    }
  }

  private static async getOrderItems(
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
      const bed = await new BedProvider().getBedByItemId(orderItem.itemId);
      if (bed === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BED_WITH_THIS_ID)],
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
      const blanket = await new BlanketProvider().getBlanketByItemId(orderItem.itemId);
      if (blanket === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.ACCOUNT_BLANKET_NOT_FOUND)],
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
      const carpet = await new CarpetProvider().getCarpetByItemId(orderItem.itemId);
      if (carpet === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CARPET_WITH_THIS_ID)],
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
      const chair = await new ChairProvider().getChairByItemId(orderItem.itemId);
      if (chair === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CHAIR_WITH_THIS_ID)],
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
      const curtain = await new CurtainProvider().getCurtainByItemId(orderItem.itemId);
      if (curtain === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CURTAIN_WITH_THIS_ID)],
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

  private static async getQuilts(orderItems: OrderItemModel[]): Promise<
    Either<
      ManagerResponse<null>,
      {
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
    >
  > {
    const quilts = [];
    for (const orderItem of orderItems) {
      const quilt = await new QuiltProvider().getQuiltByItemId(orderItem.itemId);
      if (quilt === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_QUILT_WITH_THIS_ID)],
            null,
          ),
        );
      }
      const medias = await new ItemMediaProvider().getItemMedias(quilt.itemId);
      const mediaEntites = await MediaHelper.mediasToEntities(medias);
      quilts.push({
        quiltId: quilt.quiltId,
        name: quilt.name,
        description: quilt.description,
        medias: mediaEntites,
        quiltSize: quilt.quiltSize,
        quiltMaterial: quilt.quiltMaterial,
      });
    }
    return Right.of(quilts);
  }

  private static async getSofas(orderItems: OrderItemModel[]): Promise<
    Either<
      ManagerResponse<null>,
      {
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
    >
  > {
    const sofas = [];
    for (const orderItem of orderItems) {
      const sofa = await new SofaProvider().getSofaByItemId(orderItem.itemId);
      if (sofa === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_SOFA_WITH_THIS_ID)],
            null,
          ),
        );
      }
      const medias = await new ItemMediaProvider().getItemMedias(sofa.itemId);
      const mediaEntites = await MediaHelper.mediasToEntities(medias);
      sofas.push({
        sofaId: sofa.sofaId,
        name: sofa.name,
        description: sofa.description,
        medias: mediaEntites,
        isCushioned: sofa.isCushioned,
        sofaType: sofa.sofaType,
        sofaMaterial: sofa.sofaMaterial,
      });
    }
    return Right.of(sofas);
  }

  private static async getVehicles(orderItems: OrderItemModel[]): Promise<
    Either<
      ManagerResponse<null>,
      {
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
    const vehicles = [];
    for (const orderItem of orderItems) {
      const vehicle = await new VehicleProvider().getVehicleByItemId(orderItem.itemId);
      if (vehicle === null) {
        return Left.of(
          ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_VEHICLE_WITH_THIS_ID)],
            null,
          ),
        );
      }
      const medias = await new ItemMediaProvider().getItemMedias(vehicle.itemId);
      const mediaEntites = await MediaHelper.mediasToEntities(medias);
      vehicles.push({
        vehicleId: vehicle.vehicleId,
        name: vehicle.name,
        description: vehicle.description,
        medias: mediaEntites,
        brand: vehicle.brand,
        model: vehicle.model,
        vehicleType: vehicle.vehicleType,
      });
    }
    return Right.of(vehicles);
  }
}
