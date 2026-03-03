"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ItemRepositoryImpl } from "@/features/item/data/repositories/item";
import { ItemServiceImpl } from "@/features/item/data/sources/item";
import { HttpRequest } from "@/core/helpers/http-request";
import { ListItemsUseCase, ListItemsUseCaseParams } from "@/features/item/domain/usecases/list-items.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  ListItemsFetcherParams,
  UseListItemsParams,
  UseListItemsReturnType,
} from "@/features/item/presentation/hooks/use-list-items.types";

const INITIAL_STATE: UseListItemsReturnType = {
  items: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListItemsFetcher([_, params]: [string, ListItemsFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const itemRepository = new ItemRepositoryImpl(new ItemServiceImpl(new HttpRequest()));

  const useCase = new ListItemsUseCase(itemRepository, sessionRepository);
  const useCaseParams = new ListItemsUseCaseParams({ page: params.page, limit: params.limit });

  const result = await useCase.execute(useCaseParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useListItems(params: UseListItemsParams): UseListItemsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["list-items", { ...params, clerk }], ListItemsFetcher);

  if (isLoading) return INITIAL_STATE;

  if (error) {
    return {
      items: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    items: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}
