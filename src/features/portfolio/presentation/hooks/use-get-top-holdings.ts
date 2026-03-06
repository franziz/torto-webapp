"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { TopHoldingRepositoryImpl } from "@/features/portfolio/data/repositories/top-holding";
import { TopHoldingServiceImpl } from "@/features/portfolio/data/sources/top-holding";
import { HttpRequest } from "@/core/helpers/http-request";
import {
  GetTopHoldingsUseCase,
  GetTopHoldingsUseCaseParams,
} from "@/features/portfolio/domain/usecases/get-top-holdings.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  GetTopHoldingsFetcherParams,
  UseGetTopHoldingsParams,
  UseGetTopHoldingsReturnType,
} from "@/features/portfolio/presentation/hooks/use-get-top-holdings.types";

const INITIAL_STATE: UseGetTopHoldingsReturnType = {
  holdings: null,
  loading: true,
  error: null,
};

async function TopHoldingsFetcher([_, params]: [string, GetTopHoldingsFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const topHoldingRepository = new TopHoldingRepositoryImpl(new TopHoldingServiceImpl(new HttpRequest()));

  const useCase = new GetTopHoldingsUseCase(topHoldingRepository, sessionRepository);
  const useCaseParams = new GetTopHoldingsUseCaseParams({
    currency: params.currency,
    displayCurrency: params.displayCurrency,
    limit: params.limit,
  });

  const result = await useCase.execute(useCaseParams);
  if (result instanceof DataFailed) throw result.error;

  return result.data!;
}

export function useGetTopHoldings(params: UseGetTopHoldingsParams): UseGetTopHoldingsReturnType {
  const clerk = useClerk();
  const hasValidParams = !!(params.currency || params.displayCurrency);
  const swrKey = hasValidParams ? (["top-holdings", { ...params, clerk }] as const) : null;
  const { data, isLoading, error } = useSWR(swrKey, TopHoldingsFetcher);

  if (isLoading) return INITIAL_STATE;

  if (error) {
    return {
      holdings: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    holdings: data,
    loading: false,
    error: null,
  };
}
