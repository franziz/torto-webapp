import { DataState } from "@/core/resources/data-state";
import { AssetTypeEntity } from "@/features/asset-type/domain/entities/asset-type";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListAssetTypesFilter {
  page?: number;
  limit?: number;
}

export interface AssetTypeRepository {
  list(filter: ListAssetTypesFilter, session: SessionEntity): Promise<DataState<PaginatedData<AssetTypeEntity>>>;
}
