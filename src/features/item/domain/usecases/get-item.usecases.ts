import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ItemEntity } from "@/features/item/domain/entities/item";
import { ItemRepository } from "@/features/item/domain/repositories/item";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class GetItemUseCaseParams {
  public id: string;

  constructor(args: { id: string }) {
    this.id = args.id;
  }
}

export class GetItemUseCase implements UseCase<DataState<ItemEntity>, GetItemUseCaseParams> {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetItemUseCaseParams): Promise<DataState<ItemEntity>> {
    try {
      const session = await this.retrieveSession();
      return this.itemRepository.get(params.id, session);
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
