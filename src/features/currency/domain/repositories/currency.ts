import { DataState } from "@/core/resources/data-state";
import { CurrencyEntity } from "@/features/currency/domain/entities/currency";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface CurrencyRepository {
  list(session: SessionEntity): Promise<DataState<CurrencyEntity[]>>;
}
