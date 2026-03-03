"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PortfolioRepositoryImpl } from "@/features/portfolio/data/repositories/portfolio";
import { PortfolioServiceImpl } from "@/features/portfolio/data/sources/portfolio";
import { HttpRequest } from "@/core/helpers/http-request";
import { GetPortfolioConvertedSummaryUseCase } from "@/features/portfolio/domain/usecases/get-portfolio-converted-summary.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PortfolioConvertedSummaryEntity } from "@/features/portfolio/domain/entities/portfolio-converted-summary";

type UseGetPortfolioConvertedSummaryReturnType =
  | { data: null; loading: true; error: null }
  | { data: PortfolioConvertedSummaryEntity; loading: false; error: null }
  | { data: null; loading: false; error: ServerError };

async function PortfolioConvertedSummaryFetcher([_, currency, clerk]: [
  string,
  string,
  ReturnType<typeof useClerk>,
]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
  const portfolioRepository = new PortfolioRepositoryImpl(new PortfolioServiceImpl(new HttpRequest()));

  const useCase = new GetPortfolioConvertedSummaryUseCase(portfolioRepository, sessionRepository);
  const result = await useCase.execute({ currency });
  if (result instanceof DataFailed) throw result.error;

  return result.data!;
}

export function useGetPortfolioConvertedSummary(
  currency: string | null,
): UseGetPortfolioConvertedSummaryReturnType {
  const clerk = useClerk();
  const swrKey = currency ? (["portfolio-converted-summary", currency, clerk] as const) : null;
  const { data, isLoading, error } = useSWR(swrKey, PortfolioConvertedSummaryFetcher);

  if (isLoading) return { data: null, loading: true, error: null };

  if (error) {
    return {
      data: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return { data: null, loading: true, error: null };

  return { data, loading: false, error: null };
}
