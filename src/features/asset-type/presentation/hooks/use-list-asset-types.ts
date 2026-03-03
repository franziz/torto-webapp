"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AssetTypeRepositoryImpl } from "@/features/asset-type/data/repositories/asset-type";
import { AssetTypeServiceImpl } from "@/features/asset-type/data/sources/asset-type";
import { HttpRequest } from "@/core/helpers/http-request";
import {
  ListAssetTypesUseCase,
  ListAssetTypesUseCaseParams,
} from "@/features/asset-type/domain/usecases/list-asset-types.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  ListAssetTypesFetcherParams,
  UseListAssetTypesParams,
  UseListAssetTypesReturnType,
} from "@/features/asset-type/presentation/hooks/use-list-asset-types.types";

const INITIAL_STATE: UseListAssetTypesReturnType = {
  assetTypes: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListAssetTypesFetcher([_, params]: [string, ListAssetTypesFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const assetTypeRepository = new AssetTypeRepositoryImpl(new AssetTypeServiceImpl(new HttpRequest()));

  const useCase = new ListAssetTypesUseCase(assetTypeRepository, sessionRepository);
  const useCaseParams = new ListAssetTypesUseCaseParams({ page: params.page, limit: params.limit });

  const result = await useCase.execute(useCaseParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useListAssetTypes(params: UseListAssetTypesParams): UseListAssetTypesReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["list-asset-types", { ...params, clerk }], ListAssetTypesFetcher);

  if (isLoading) return INITIAL_STATE;

  if (error) {
    return {
      assetTypes: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    assetTypes: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}
