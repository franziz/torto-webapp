"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { TransactionTypeRepositoryImpl } from "@/features/transaction-type/data/repositories/transaction-type";
import { TransactionTypeServiceImpl } from "@/features/transaction-type/data/sources/transaction-type";
import { HttpRequest } from "@/core/helpers/http-request";
import {
  ListTransactionTypesUseCase,
  ListTransactionTypesUseCaseParams,
} from "@/features/transaction-type/domain/usecases/list-transaction-types.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  ListTransactionTypesFetcherParams,
  UseListTransactionTypesParams,
  UseListTransactionTypesReturnType,
} from "@/features/transaction-type/presentation/hooks/use-list-transaction-types.types";

const INITIAL_STATE: UseListTransactionTypesReturnType = {
  transactionTypes: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListTransactionTypesFetcher([_, params]: [string, ListTransactionTypesFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const transactionTypeRepository = new TransactionTypeRepositoryImpl(
    new TransactionTypeServiceImpl(new HttpRequest()),
  );

  const useCase = new ListTransactionTypesUseCase(transactionTypeRepository, sessionRepository);
  const useCaseParams = new ListTransactionTypesUseCaseParams({ page: params.page, limit: params.limit });

  const result = await useCase.execute(useCaseParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useListTransactionTypes(params: UseListTransactionTypesParams): UseListTransactionTypesReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    ["list-transaction-types", { ...params, clerk }],
    ListTransactionTypesFetcher,
  );

  if (isLoading) return INITIAL_STATE;

  if (error) {
    return {
      transactionTypes: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    transactionTypes: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}
