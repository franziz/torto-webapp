"use client";

import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AssetRepositoryImpl } from "@/features/asset/data/repositories/asset";
import { AssetServiceImpl } from "@/features/asset/data/sources/asset";
import { HttpRequest } from "@/core/helpers/http-request";
import { DeleteAssetUseCase, DeleteAssetUseCaseParams } from "@/features/asset/domain/usecases/delete-asset.usecases";
import { DataFailed } from "@/core/resources/data-state";

export function useDeleteAsset() {
  const clerk = useClerk();
  const { mutate } = useSWRConfig();

  const fetcher = async (_: string, { arg }: { arg: DeleteAssetUseCaseParams }) => {
    const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
    const assetRepository = new AssetRepositoryImpl(new AssetServiceImpl(new HttpRequest()));

    const useCase = new DeleteAssetUseCase(assetRepository, sessionRepository);
    const result = await useCase.execute(arg);
    if (result instanceof DataFailed) throw result.error;
    return result.data;
  };

  const { trigger, isMutating, error } = useSWRMutation("delete-asset", fetcher, {
    onSuccess: () => {
      mutate((key: any) => Array.isArray(key) && key[0] === "list-assets");
    },
  });

  return { trigger, loading: isMutating, error };
}
