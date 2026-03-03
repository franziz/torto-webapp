"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PortfolioRepositoryImpl } from "@/features/portfolio/data/repositories/portfolio";
import { PortfolioServiceImpl } from "@/features/portfolio/data/sources/portfolio";
import { HttpRequest } from "@/core/helpers/http-request";
import { GetPortfolioByAccountUseCase } from "@/features/portfolio/domain/usecases/get-portfolio-by-account.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PortfolioByAccountEntity } from "@/features/portfolio/domain/entities/portfolio-by-account";

type UseGetPortfolioByAccountReturnType =
  | { data: null; loading: true; error: null }
  | { data: PortfolioByAccountEntity[]; loading: false; error: null }
  | { data: null; loading: false; error: ServerError };

async function PortfolioByAccountFetcher([_, clerk]: [string, ReturnType<typeof useClerk>]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
  const portfolioRepository = new PortfolioRepositoryImpl(new PortfolioServiceImpl(new HttpRequest()));

  const useCase = new GetPortfolioByAccountUseCase(portfolioRepository, sessionRepository);
  const result = await useCase.execute();
  if (result instanceof DataFailed) throw result.error;

  return result.data!;
}

export function useGetPortfolioByAccount(): UseGetPortfolioByAccountReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["portfolio-by-account", clerk], PortfolioByAccountFetcher);

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
