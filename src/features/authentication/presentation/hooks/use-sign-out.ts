"use client";

import useSWRMutation from "swr/mutation";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { SignOutUseCase } from "@/features/authentication/domain/usecases/sign-out.usecases";
import { DataFailed } from "@/core/resources/data-state";

export function useSignOut() {
  const clerk = useClerk();

  const fetcher = async () => {
    const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
    const signOut = new SignOutUseCase(sessionRepository);
    const result = await signOut.execute();
    if (result instanceof DataFailed) throw result.error;
  };

  const { trigger, isMutating } = useSWRMutation("sign-out", fetcher);

  return { trigger, loading: isMutating };
}
