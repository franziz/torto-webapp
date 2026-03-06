import { DataState } from "@/core/resources/data-state";
import { TopHoldingEntity } from "@/features/portfolio/domain/entities/top-holding";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface GetTopHoldingsFilter {
  currency?: string;
  displayCurrency?: string;
  limit?: number;
}

export interface TopHoldingRepository {
  getTopHoldings(filter: GetTopHoldingsFilter, session: SessionEntity): Promise<DataState<TopHoldingEntity[]>>;
}
