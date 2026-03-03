import { useClerk } from "@clerk/nextjs";
import { AssetEntity } from "@/features/asset/domain/entities/asset";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";

export type UseListAssetsParams = {
  page?: number;
  limit?: number;
  accountId?: string;
  assetTypeId?: string;
};

export type ListAssetsFetcherParams = UseListAssetsParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  assets: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  assets: AssetEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  assets: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListAssetsReturnType = InitialState | LoadedState | ErrorState;
