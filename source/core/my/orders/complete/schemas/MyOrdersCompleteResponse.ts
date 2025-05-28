import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { OrderEntity } from "../../../../../common/entities/OrderEntity";
import type { EBedSize } from "../../../../../common/enums/EBedSize";
import type { EBlanketMaterial } from "../../../../../common/enums/EBlanketMaterial";
import type { EBlanketSize } from "../../../../../common/enums/EBlanketSize";
import type { ECarpetMaterial } from "../../../../../common/enums/ECarpetMaterial";
import type { ECurtainType } from "../../../../../common/enums/ECurtainType";
import type { EMediaType } from "../../../../../common/enums/EMediaType";
import type { EOrderState } from "../../../../../common/enums/EOrderState";
import type { EQuiltMaterial } from "../../../../../common/enums/EQuiltMaterial";
import type { EQuiltSize } from "../../../../../common/enums/EQuiltSize";
import type { EServiceCategory } from "../../../../../common/enums/EServiceCategory";
import type { ESofaType } from "../../../../../common/enums/ESofaType";
import type { EVehicleType } from "../../../../../common/enums/EVehicleType";

export class MyOrdersCompleteResponse implements IResponse {
  private constructor(
    public readonly orderId: number,
    public readonly service: {
      readonly serviceId: number;
      readonly title: string;
      readonly media: {
        readonly mediaId: number;
        readonly mediaType: EMediaType;
        readonly extension: string;
        readonly url: string;
      } | null;
      readonly serviceCategory: EServiceCategory;
      readonly description: string;
      readonly unitPrice: number;
    },
    public readonly address: {
      readonly countryName: string;
      readonly provinceName: string;
      readonly districtName: string;
      readonly neighborhoodName: string;
    },
    public readonly business: {
      readonly businessId: number;
      readonly name: string;
      readonly media: {
        readonly mediaId: number;
        readonly mediaType: EMediaType;
        readonly extension: string;
        readonly url: string;
      } | null;
      readonly phone: string;
      readonly email: string;
      readonly isOpen: boolean;
      readonly stars: number | null;
      readonly reviewsCount: number;
      readonly hoursToday: {
        readonly from: string | null;
        readonly to: string | null;
      } | null;
    },
    public readonly customer: {
      readonly accountId: number;
      readonly phone: string;
      readonly name: string;
      readonly surname: string;
    },
    public readonly items:
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
        }[],
    public readonly orderState: EOrderState,
    public readonly price: number | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static fromEntity(entity: OrderEntity): MyOrdersCompleteResponse {
    return new MyOrdersCompleteResponse(
      entity.model.orderId,
      {
        serviceId: entity.model.serviceId,
        title: entity.model.serviceTitle,
        media: entity.serviceMedia,
        serviceCategory: entity.model.serviceCategory,
        description: entity.model.serviceDescription,
        unitPrice: entity.model.unitPrice,
      },
      {
        countryName: entity.model.countryName,
        provinceName: entity.model.provinceName,
        districtName: entity.model.districtName,
        neighborhoodName: entity.model.neighborhoodName,
      },
      {
        businessId: entity.model.businessId,
        name: entity.model.businessName,
        media: entity.businessMedia,
        phone: entity.model.businessPhone,
        email: entity.model.businessEmail,
        isOpen: entity.model.isOpen,
        stars: entity.model.stars,
        reviewsCount: entity.model.reviewsCount,
        hoursToday: entity.hoursToday,
      },
      {
        accountId: entity.model.accountId,
        phone: entity.model.customerPhone,
        name: entity.model.customerName,
        surname: entity.model.customerSurname,
      },
      entity.items,
      entity.model.orderState,
      entity.model.price,
      entity.model.createdAt,
      entity.model.updatedAt,
    );
  }

  public static fromEntities(entities: OrderEntity[]): MyOrdersCompleteResponse[] {
    return entities.map((entity) => MyOrdersCompleteResponse.fromEntity(entity));
  }
}
