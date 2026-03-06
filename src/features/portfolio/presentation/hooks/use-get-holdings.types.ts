import { useClerk } from "@clerk/nextjs";
import { HoldingEntity } from "@/features/portfolio/domain/entities/holding";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";

export type UseGetHoldingsParams = {
  page?: number;
  limit?: number;
  currency?: string;
  displayCurrency?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
};

export type GetHoldingsFetcherParams = UseGetHoldingsParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  holdings: null;
  meta: null;
  exchangeRatesUsed: null;
  loading: true;
  error: null;
};

type LoadedState = {
  holdings: HoldingEntity[];
  meta: PaginationMeta;
  exchangeRatesUsed: Record<string, number> | null;
  loading: false;
  error: null;
};

type ErrorState = {
  holdings: null;
  meta: null;
  exchangeRatesUsed: null;
  loading: false;
  error: ServerError;
};

export type UseGetHoldingsReturnType = InitialState | LoadedState | ErrorState;
