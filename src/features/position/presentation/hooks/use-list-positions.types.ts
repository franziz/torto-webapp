import { useClerk } from "@clerk/nextjs";
import { PositionEntity } from "@/features/position/domain/entities/position";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";

export type UseListPositionsParams = {
  page?: number;
  limit?: number;
  currency?: string;
};

export type ListPositionsFetcherParams = UseListPositionsParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  positions: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  positions: PositionEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  positions: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListPositionsReturnType = InitialState | LoadedState | ErrorState;
