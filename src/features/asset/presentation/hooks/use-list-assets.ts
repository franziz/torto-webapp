"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AssetRepositoryImpl } from "@/features/asset/data/repositories/asset";
import { AssetServiceImpl } from "@/features/asset/data/sources/asset";
import { HttpRequest } from "@/core/helpers/http-request";
import { ListAssetsUseCase, ListAssetsUseCaseParams } from "@/features/asset/domain/usecases/list-assets.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  ListAssetsFetcherParams,
  UseListAssetsParams,
  UseListAssetsReturnType,
} from "@/features/asset/presentation/hooks/use-list-assets.types";

const INITIAL_STATE: UseListAssetsReturnType = {
  assets: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListAssetsFetcher([_, params]: [string, ListAssetsFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const assetRepository = new AssetRepositoryImpl(new AssetServiceImpl(new HttpRequest()));

  const useCase = new ListAssetsUseCase(assetRepository, sessionRepository);
  const useCaseParams = new ListAssetsUseCaseParams({
    page: params.page,
    limit: params.limit,
    accountId: params.accountId,
    assetTypeId: params.assetTypeId,
  });

  const result = await useCase.execute(useCaseParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useListAssets(params: UseListAssetsParams): UseListAssetsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["list-assets", { ...params, clerk }], ListAssetsFetcher);

  if (isLoading) return INITIAL_STATE;

  if (error) {
    return {
      assets: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    assets: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}
