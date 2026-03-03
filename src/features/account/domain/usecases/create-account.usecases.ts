import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { AccountEntity } from "@/features/account/domain/entities/account";
import { AccountRepository, CreateAccountParams } from "@/features/account/domain/repositories/account";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class CreateAccountUseCaseParams {
  public name: string;
  public country: string;
  public currency: string;
  public description?: string;

  constructor(args: { name: string; country: string; currency: string; description?: string }) {
    this.name = args.name;
    this.country = args.country;
    this.currency = args.currency;
    this.description = args.description;
  }
}

export class CreateAccountUseCase implements UseCase<DataState<AccountEntity>, CreateAccountUseCaseParams> {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CreateAccountUseCaseParams): Promise<DataState<AccountEntity>> {
    try {
      const session = await this.retrieveSession();
      const createParams: CreateAccountParams = {
        name: params.name,
        country: params.country,
        currency: params.currency,
        description: params.description,
      };
      return this.accountRepository.create(createParams, session);
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
