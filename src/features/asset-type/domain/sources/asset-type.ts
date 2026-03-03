import { AssetTypeModel } from "@/features/asset-type/data/models/asset-type";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListAssetTypesServiceFilter {
  page?: number;
  limit?: number;
}

export interface AssetTypeService {
  list(
    filter: ListAssetTypesServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: AssetTypeModel[]; meta: PaginationMetaModel }>;
}
