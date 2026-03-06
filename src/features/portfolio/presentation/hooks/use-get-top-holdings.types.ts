import { useClerk } from "@clerk/nextjs";
import { TopHoldingEntity } from "@/features/portfolio/domain/entities/top-holding";
import { ServerError } from "@/core/resources/server-error";

export type UseGetTopHoldingsParams = {
  currency?: string;
  displayCurrency?: string;
  limit?: number;
};

export type GetTopHoldingsFetcherParams = UseGetTopHoldingsParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  holdings: null;
  loading: true;
  error: null;
};

type LoadedState = {
  holdings: TopHoldingEntity[];
  loading: false;
  error: null;
};

type ErrorState = {
  holdings: null;
  loading: false;
  error: ServerError;
};

export type UseGetTopHoldingsReturnType = InitialState | LoadedState | ErrorState;
