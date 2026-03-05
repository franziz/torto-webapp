import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { PositionEntity } from "@/features/position/domain/entities/position";
import { PositionRepository } from "@/features/position/domain/repositories/position";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class UpdateCurrentPriceUseCaseParams {
  public assetId: string;
  public price: number;

  constructor(args: { assetId: string; price: number }) {
    this.assetId = args.assetId;
    this.price = args.price;
  }
}

export class UpdateCurrentPriceUseCase
  implements UseCase<DataState<PositionEntity>, UpdateCurrentPriceUseCaseParams>
{
  constructor(
    private readonly positionRepository: PositionRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: UpdateCurrentPriceUseCaseParams): Promise<DataState<PositionEntity>> {
    try {
      const session = await this.retrieveSession();
      return this.positionRepository.updateCurrentPrice(params.assetId, params.price, session);
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
