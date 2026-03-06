import { HoldingModel } from "@/features/portfolio/data/models/holding";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface GetHoldingsServiceFilter {
  page?: number;
  limit?: number;
  currency?: string;
  displayCurrency?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

export interface HoldingsServiceResult {
  data: HoldingModel[];
  meta: PaginationMeta;
  exchangeRatesUsed?: Record<string, number>;
}

export interface HoldingService {
  getHoldings(filter: GetHoldingsServiceFilter, session: SessionEntity): Promise<HoldingsServiceResult>;
}
