"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PortfolioRepositoryImpl } from "@/features/portfolio/data/repositories/portfolio";
import { PortfolioServiceImpl } from "@/features/portfolio/data/sources/portfolio";
import { HttpRequest } from "@/core/helpers/http-request";
import { GetPortfolioSummaryUseCase } from "@/features/portfolio/domain/usecases/get-portfolio-summary.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PortfolioSummaryEntity } from "@/features/portfolio/domain/entities/portfolio-summary";

type UseGetPortfolioSummaryReturnType =
  | { data: null; loading: true; error: null }
  | { data: PortfolioSummaryEntity[]; loading: false; error: null }
  | { data: null; loading: false; error: ServerError };

async function PortfolioSummaryFetcher([_, clerk]: [string, ReturnType<typeof useClerk>]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
  const portfolioRepository = new PortfolioRepositoryImpl(new PortfolioServiceImpl(new HttpRequest()));

  const useCase = new GetPortfolioSummaryUseCase(portfolioRepository, sessionRepository);
  const result = await useCase.execute();
  if (result instanceof DataFailed) throw result.error;

  return result.data!;
}

export function useGetPortfolioSummary(): UseGetPortfolioSummaryReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["portfolio-summary", clerk], PortfolioSummaryFetcher);

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
