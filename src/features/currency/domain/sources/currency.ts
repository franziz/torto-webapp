import { CurrencyModel } from "@/features/currency/data/models/currency";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface CurrencyService {
  list(session: SessionEntity): Promise<CurrencyModel[]>;
}
