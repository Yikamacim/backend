import type { ProviderResponse } from "../../../@types/responses.d.ts";
import type { IModel } from "../../../app/interfaces/IModel.ts";

export type HandlerResponse<D extends IModel | boolean | null> = ProviderResponse<D>;
