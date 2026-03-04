import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { CurrencyEntity } from "@/features/currency/domain/entities/currency";
import { CurrencyRepository } from "@/features/currency/domain/repositories/currency";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class ListCurrenciesUseCase implements UseCase<DataState<CurrencyEntity[]>, void> {
  constructor(
    private readonly currencyRepository: CurrencyRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(): Promise<DataState<CurrencyEntity[]>> {
    try {
      const session = await this.retrieveSession();
      return this.currencyRepository.list(session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async retrieveSession() {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    return session.data;
  }
}
