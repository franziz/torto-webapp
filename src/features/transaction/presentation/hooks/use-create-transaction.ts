"use client";

import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { TransactionRepositoryImpl } from "@/features/transaction/data/repositories/transaction";
import { TransactionServiceImpl } from "@/features/transaction/data/sources/transaction";
import { HttpRequest } from "@/core/helpers/http-request";
import {
  CreateTransactionUseCase,
  CreateTransactionUseCaseParams,
} from "@/features/transaction/domain/usecases/create-transaction.usecases";
import { DataFailed } from "@/core/resources/data-state";

export function useCreateTransaction() {
  const clerk = useClerk();
  const { mutate } = useSWRConfig();

  const fetcher = async (_: string, { arg }: { arg: CreateTransactionUseCaseParams }) => {
    const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
    const transactionRepository = new TransactionRepositoryImpl(new TransactionServiceImpl(new HttpRequest()));

    const useCase = new CreateTransactionUseCase(transactionRepository, sessionRepository);
    const result = await useCase.execute(arg);
    if (result instanceof DataFailed) throw result.error;
    return result.data;
  };

  const { trigger, isMutating, error } = useSWRMutation("create-transaction", fetcher, {
    onSuccess: () => {
      mutate((key: any) => Array.isArray(key) && key[0] === "list-transactions");
    },
  });

  return { trigger, loading: isMutating, error };
}
