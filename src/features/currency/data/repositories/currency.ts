import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { CurrencyRepository } from "@/features/currency/domain/repositories/currency";
import { CurrencyEntity } from "@/features/currency/domain/entities/currency";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CurrencyService } from "@/features/currency/domain/sources/currency";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class CurrencyRepositoryImpl implements CurrencyRepository {
  constructor(private readonly currencyService: CurrencyService) {}

  public async list(session: SessionEntity): Promise<DataState<CurrencyEntity[]>> {
    try {
      const result = await this.currencyService.list(session);
      return new DataSuccess(result.map((model) => model.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
