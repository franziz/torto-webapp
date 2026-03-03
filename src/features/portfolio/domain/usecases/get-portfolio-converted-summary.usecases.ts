import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { PortfolioConvertedSummaryEntity } from "@/features/portfolio/domain/entities/portfolio-converted-summary";
import { PortfolioRepository } from "@/features/portfolio/domain/repositories/portfolio";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class GetPortfolioConvertedSummaryUseCase
  implements UseCase<DataState<PortfolioConvertedSummaryEntity>, { currency: string }>
{
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute({ currency }: { currency: string }): Promise<DataState<PortfolioConvertedSummaryEntity>> {
    try {
      const session = await this.retrieveSession();
      return this.portfolioRepository.getConvertedSummary(session, currency);
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
