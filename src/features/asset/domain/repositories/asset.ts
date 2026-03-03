import { DataState } from "@/core/resources/data-state";
import { AssetEntity } from "@/features/asset/domain/entities/asset";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListAssetsFilter {
  page?: number;
  limit?: number;
  accountId?: string;
  assetTypeId?: string;
}

export interface CreateAssetParams {
  accountId: string;
  assetTypeId: string;
  name: string;
  ticker?: string;
  description?: string;
}

export interface AssetRepository {
  list(filter: ListAssetsFilter, session: SessionEntity): Promise<DataState<PaginatedData<AssetEntity>>>;
  create(params: CreateAssetParams, session: SessionEntity): Promise<DataState<AssetEntity>>;
  delete(id: string, session: SessionEntity): Promise<DataState<void>>;
}
