"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { CurrencyRepositoryImpl } from "@/features/currency/data/repositories/currency";
import { CurrencyServiceImpl } from "@/features/currency/data/sources/currency";
import { HttpRequest } from "@/core/helpers/http-request";
import { ListCurrenciesUseCase } from "@/features/currency/domain/usecases/list-currencies.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { UseListCurrenciesReturnType } from "@/features/currency/presentation/hooks/use-list-currencies.types";

async function ListCurrenciesFetcher([_, clerk]: [string, ReturnType<typeof useClerk>]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
  const currencyRepository = new CurrencyRepositoryImpl(new CurrencyServiceImpl(new HttpRequest()));

  const useCase = new ListCurrenciesUseCase(currencyRepository, sessionRepository);
  const result = await useCase.execute();
  if (result instanceof DataFailed) throw result.error;

  return result.data!;
}

export function useListCurrencies(): UseListCurrenciesReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["list-currencies", clerk], ListCurrenciesFetcher);

  if (isLoading) return { currencies: null, loading: true, error: null };

  if (error) {
    return {
      currencies: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return { currencies: null, loading: true, error: null };

  return { currencies: data, loading: false, error: null };
}
