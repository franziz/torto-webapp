"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { HoldingRepositoryImpl } from "@/features/portfolio/data/repositories/holding";
import { HoldingServiceImpl } from "@/features/portfolio/data/sources/holding";
import { HttpRequest } from "@/core/helpers/http-request";
import { GetHoldingsUseCase, GetHoldingsUseCaseParams } from "@/features/portfolio/domain/usecases/get-holdings.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  GetHoldingsFetcherParams,
  UseGetHoldingsParams,
  UseGetHoldingsReturnType,
} from "@/features/portfolio/presentation/hooks/use-get-holdings.types";

const INITIAL_STATE: UseGetHoldingsReturnType = {
  holdings: null,
  meta: null,
  exchangeRatesUsed: null,
  loading: true,
  error: null,
};

async function HoldingsFetcher([_, params]: [string, GetHoldingsFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const holdingRepository = new HoldingRepositoryImpl(new HoldingServiceImpl(new HttpRequest()));

  const useCase = new GetHoldingsUseCase(holdingRepository, sessionRepository);
  const useCaseParams = new GetHoldingsUseCaseParams({
    page: params.page,
    limit: params.limit,
    currency: params.currency,
    displayCurrency: params.displayCurrency,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    search: params.search,
  });

  const result = await useCase.execute(useCaseParams);
  if (result instanceof DataFailed) throw result.error;

  return result.data!;
}

export function useGetHoldings(params: UseGetHoldingsParams): UseGetHoldingsReturnType {
  const clerk = useClerk();
  const swrKey = ["portfolio-holdings", { ...params, clerk }] as const;
  const { data, isLoading, error } = useSWR(swrKey, HoldingsFetcher);

  if (isLoading) return INITIAL_STATE;

  if (error) {
    return {
      holdings: null,
      meta: null,
      exchangeRatesUsed: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    holdings: data.data,
    meta: data.meta,
    exchangeRatesUsed: data.exchangeRatesUsed ?? null,
    loading: false,
    error: null,
  };
}
