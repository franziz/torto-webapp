import { AssetModel } from "@/features/asset/data/models/asset";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListAssetsServiceFilter {
  page?: number;
  limit?: number;
  accountId?: string;
  assetTypeId?: string;
}

export interface CreateAssetServiceParams {
  accountId: string;
  assetTypeId: string;
  name: string;
  ticker?: string;
  description?: string;
  maturityDate?: string;
  faceValue?: number;
}

export interface UpdateAssetServiceParams {
  name: string;
  ticker?: string;
  description?: string;
  maturityDate?: string;
  faceValue?: number;
}

export interface AssetService {
  list(
    filter: ListAssetsServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: AssetModel[]; meta: PaginationMetaModel }>;
  create(params: CreateAssetServiceParams, session: SessionEntity): Promise<AssetModel>;
  update(id: string, params: UpdateAssetServiceParams, session: SessionEntity): Promise<AssetModel>;
  delete(id: string, session: SessionEntity): Promise<void>;
}
