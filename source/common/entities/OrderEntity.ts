import type { IEntity } from "../../app/interfaces/IEntity";
import type { EBedSize } from "../enums/EBedSize";
import type { EBlanketMaterial } from "../enums/EBlanketMaterial";
import type { EBlanketSize } from "../enums/EBlanketSize";
import type { ECarpetMaterial } from "../enums/ECarpetMaterial";
import type { ECurtainType } from "../enums/ECurtainType";
import type { EMediaType } from "../enums/EMediaType";
import type { EQuiltMaterial } from "../enums/EQuiltMaterial";
import type { EQuiltSize } from "../enums/EQuiltSize";
import type { ESofaType } from "../enums/ESofaType";
import type { EVehicleType } from "../enums/EVehicleType";
import type { OrderViewModel } from "../models/OrderViewModel";
import type { MediaEntity } from "./MediaEntity";

export class OrderEntity implements IEntity {
  public constructor(
    public readonly model: OrderViewModel,
    public readonly serviceMedia: MediaEntity | null,
    public readonly businessMedia: MediaEntity | null,
    public readonly hoursToday: {
      readonly from: string | null;
      readonly to: string | null;
    } | null,
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
  ) {}
}
