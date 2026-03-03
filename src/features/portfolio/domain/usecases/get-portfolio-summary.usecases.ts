import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { PortfolioSummaryEntity } from "@/features/portfolio/domain/entities/portfolio-summary";
import { PortfolioRepository } from "@/features/portfolio/domain/repositories/portfolio";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class GetPortfolioSummaryUseCase implements UseCase<DataState<PortfolioSummaryEntity[]>, void> {
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(): Promise<DataState<PortfolioSummaryEntity[]>> {
    try {
      const session = await this.retrieveSession();
      return this.portfolioRepository.getSummary(session);
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
