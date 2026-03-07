import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { PositionEntity } from "@/features/position/domain/entities/position";
import { PositionRepository } from "@/features/position/domain/repositories/position";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class ListPositionsUseCaseParams {
  public page?: number;
  public limit?: number;
  public currency?: string;

  constructor(args: { page?: number; limit?: number; currency?: string }) {
    this.page = args.page;
    this.limit = args.limit;
    this.currency = args.currency;
  }
}

export class ListPositionsUseCase
  implements UseCase<DataState<PaginatedData<PositionEntity>>, ListPositionsUseCaseParams>
{
  constructor(
    private readonly positionRepository: PositionRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListPositionsUseCaseParams): Promise<DataState<PaginatedData<PositionEntity>>> {
    try {
      const session = await this.retrieveSession();
      return this.positionRepository.list({ page: params.page, limit: params.limit, currency: params.currency }, session);
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
