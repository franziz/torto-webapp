"use client";

import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PositionRepositoryImpl } from "@/features/position/data/repositories/position";
import { PositionServiceImpl } from "@/features/position/data/sources/position";
import { HttpRequest } from "@/core/helpers/http-request";
import {
  UpdateCurrentPriceUseCase,
  UpdateCurrentPriceUseCaseParams,
} from "@/features/position/domain/usecases/update-current-price.usecases";
import { DataFailed } from "@/core/resources/data-state";

export function useUpdateCurrentPrice() {
  const clerk = useClerk();
  const { mutate } = useSWRConfig();

  const fetcher = async (_: string, { arg }: { arg: UpdateCurrentPriceUseCaseParams }) => {
    const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
    const positionRepository = new PositionRepositoryImpl(new PositionServiceImpl(new HttpRequest()));

    const useCase = new UpdateCurrentPriceUseCase(positionRepository, sessionRepository);
    const result = await useCase.execute(arg);
    if (result instanceof DataFailed) throw result.error;
    return result.data;
  };

  const { trigger, isMutating, error } = useSWRMutation("update-current-price", fetcher, {
    onSuccess: () => {
      mutate(
        (key: any) =>
          Array.isArray(key) &&
          ["list-positions", "portfolio-summary", "portfolio-by-asset-type", "portfolio-by-account", "portfolio-converted-summary"].includes(key[0]),
      );
    },
  });

  return { trigger, loading: isMutating, error };
}
