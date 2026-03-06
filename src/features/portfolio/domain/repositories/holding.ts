import { DataState } from "@/core/resources/data-state";
import { HoldingEntity } from "@/features/portfolio/domain/entities/holding";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface GetHoldingsFilter {
  page?: number;
  limit?: number;
  currency?: string;
  displayCurrency?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

export interface HoldingsResult {
  data: HoldingEntity[];
  meta: PaginationMeta;
  exchangeRatesUsed?: Record<string, number>;
}

export interface HoldingRepository {
  getHoldings(filter: GetHoldingsFilter, session: SessionEntity): Promise<DataState<HoldingsResult>>;
}
