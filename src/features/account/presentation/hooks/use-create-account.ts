"use client";

import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { HttpRequest } from "@/core/helpers/http-request";
import {
  CreateAccountUseCase,
  CreateAccountUseCaseParams,
} from "@/features/account/domain/usecases/create-account.usecases";
import { DataFailed } from "@/core/resources/data-state";

export function useCreateAccount() {
  const clerk = useClerk();
  const { mutate } = useSWRConfig();

  const fetcher = async (_: string, { arg }: { arg: CreateAccountUseCaseParams }) => {
    const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
    const accountRepository = new AccountRepositoryImpl(new AccountServiceImpl(new HttpRequest()));

    const useCase = new CreateAccountUseCase(accountRepository, sessionRepository);
    const result = await useCase.execute(arg);
    if (result instanceof DataFailed) throw result.error;
    return result.data;
  };

  const { trigger, isMutating, error } = useSWRMutation("create-account", fetcher, {
    onSuccess: () => {
      mutate((key: any) => Array.isArray(key) && key[0] === "list-accounts");
    },
  });

  return { trigger, loading: isMutating, error };
}
