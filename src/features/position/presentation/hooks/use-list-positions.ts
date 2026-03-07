"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PositionRepositoryImpl } from "@/features/position/data/repositories/position";
import { PositionServiceImpl } from "@/features/position/data/sources/position";
import { HttpRequest } from "@/core/helpers/http-request";
import {
  ListPositionsUseCase,
  ListPositionsUseCaseParams,
} from "@/features/position/domain/usecases/list-positions.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  ListPositionsFetcherParams,
  UseListPositionsParams,
  UseListPositionsReturnType,
} from "@/features/position/presentation/hooks/use-list-positions.types";

const INITIAL_STATE: UseListPositionsReturnType = {
  positions: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListPositionsFetcher([_, params]: [string, ListPositionsFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const positionRepository = new PositionRepositoryImpl(new PositionServiceImpl(new HttpRequest()));

  const useCase = new ListPositionsUseCase(positionRepository, sessionRepository);
  const useCaseParams = new ListPositionsUseCaseParams({ page: params.page, limit: params.limit, currency: params.currency });

  const result = await useCase.execute(useCaseParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useListPositions(params: UseListPositionsParams): UseListPositionsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["list-positions", { ...params, clerk }], ListPositionsFetcher);

  if (isLoading) return INITIAL_STATE;

  if (error) {
    return {
      positions: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    positions: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}
