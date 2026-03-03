"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { TransactionRepositoryImpl } from "@/features/transaction/data/repositories/transaction";
import { TransactionServiceImpl } from "@/features/transaction/data/sources/transaction";
import { HttpRequest } from "@/core/helpers/http-request";
import {
  ListTransactionsUseCase,
  ListTransactionsUseCaseParams,
} from "@/features/transaction/domain/usecases/list-transactions.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  ListTransactionsFetcherParams,
  UseListTransactionsParams,
  UseListTransactionsReturnType,
} from "@/features/transaction/presentation/hooks/use-list-transactions.types";

const INITIAL_STATE: UseListTransactionsReturnType = {
  transactions: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListTransactionsFetcher([_, params]: [string, ListTransactionsFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const transactionRepository = new TransactionRepositoryImpl(new TransactionServiceImpl(new HttpRequest()));

  const useCase = new ListTransactionsUseCase(transactionRepository, sessionRepository);
  const useCaseParams = new ListTransactionsUseCaseParams({
    page: params.page,
    limit: params.limit,
    assetId: params.assetId,
    accountId: params.accountId,
    transactionTypeId: params.transactionTypeId,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  });

  const result = await useCase.execute(useCaseParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useListTransactions(params: UseListTransactionsParams): UseListTransactionsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["list-transactions", { ...params, clerk }], ListTransactionsFetcher);

  if (isLoading) return INITIAL_STATE;

  if (error) {
    return {
      transactions: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    transactions: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}
