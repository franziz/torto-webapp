"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { HttpRequest } from "@/core/helpers/http-request";
import {
  ListAccountsUseCase,
  ListAccountsUseCaseParams,
} from "@/features/account/domain/usecases/list-accounts.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  ListAccountsFetcherParams,
  UseListAccountsParams,
  UseListAccountsReturnType,
} from "@/features/account/presentation/hooks/use-list-accounts.types";

const INITIAL_STATE: UseListAccountsReturnType = {
  accounts: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListAccountsFetcher([_, params]: [string, ListAccountsFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const accountRepository = new AccountRepositoryImpl(new AccountServiceImpl(new HttpRequest()));

  const useCase = new ListAccountsUseCase(accountRepository, sessionRepository);
  const useCaseParams = new ListAccountsUseCaseParams({ page: params.page, limit: params.limit });

  const result = await useCase.execute(useCaseParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useListAccounts(params: UseListAccountsParams): UseListAccountsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["list-accounts", { ...params, clerk }], ListAccountsFetcher);

  if (isLoading) return INITIAL_STATE;

  if (error) {
    return {
      accounts: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    accounts: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}
