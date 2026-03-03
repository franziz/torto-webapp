"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ItemRepositoryImpl } from "@/features/item/data/repositories/item";
import { ItemServiceImpl } from "@/features/item/data/sources/item";
import { HttpRequest } from "@/core/helpers/http-request";
import { GetItemUseCase, GetItemUseCaseParams } from "@/features/item/domain/usecases/get-item.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  GetItemFetcherParams,
  UseGetItemParams,
  UseGetItemReturnType,
} from "@/features/item/presentation/hooks/use-get-item.types";

const INITIAL_STATE: UseGetItemReturnType = {
  item: null,
  loading: true,
  error: null,
};

async function GetItemFetcher([_, params]: [string, GetItemFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const itemRepository = new ItemRepositoryImpl(new ItemServiceImpl(new HttpRequest()));

  const useCase = new GetItemUseCase(itemRepository, sessionRepository);
  const useCaseParams = new GetItemUseCaseParams({ id: params.id });

  const result = await useCase.execute(useCaseParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useGetItem(params: UseGetItemParams): UseGetItemReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["get-item", { ...params, clerk }], GetItemFetcher);

  if (isLoading) return INITIAL_STATE;

  if (error) {
    return {
      item: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    item: data,
    loading: false,
    error: null,
  };
}
