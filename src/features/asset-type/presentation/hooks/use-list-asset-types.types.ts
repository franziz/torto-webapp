import { useClerk } from "@clerk/nextjs";
import { AssetTypeEntity } from "@/features/asset-type/domain/entities/asset-type";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";

export type UseListAssetTypesParams = {
  page?: number;
  limit?: number;
};

export type ListAssetTypesFetcherParams = UseListAssetTypesParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  assetTypes: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  assetTypes: AssetTypeEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  assetTypes: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListAssetTypesReturnType = InitialState | LoadedState | ErrorState;
