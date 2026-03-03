import {
  AccountService,
  CreateAccountServiceParams,
  ListAccountsServiceFilter,
  UpdateAccountServiceParams,
} from "@/features/account/domain/sources/account";
import { AccountModel } from "@/features/account/data/models/account";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class AccountServiceImpl implements AccountService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    filter: ListAccountsServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: AccountModel[]; meta: PaginationMetaModel }> {
    try {
      const searchParams: Record<string, string> = {};
      if (filter.page) searchParams.page = String(filter.page);
      if (filter.limit) searchParams.limit = String(filter.limit);

      const result = await this.http.request(
        {
          path: "/api/accounts",
          method: "GET",
          searchParams,
          session,
        },
        { requireAccount: false },
      );

      return {
        data: (result.data ?? []).map((item: Record<string, any>) => AccountModel.fromJson(item)),
        meta: PaginationMetaModel.fromJson(result.meta ?? {}),
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async create(params: CreateAccountServiceParams, session: SessionEntity): Promise<AccountModel> {
    try {
      const result = await this.http.request(
        {
          path: "/api/accounts",
          method: "POST",
          body: {
            name: params.name,
            country: params.country,
            currency: params.currency,
            description: params.description,
          },
          session,
        },
        { requireAccount: false },
      );

      return AccountModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async update(id: string, params: UpdateAccountServiceParams, session: SessionEntity): Promise<AccountModel> {
    try {
      const result = await this.http.request(
        {
          path: `/api/accounts/${id}`,
          method: "PUT",
          body: {
            name: params.name,
            country: params.country,
            currency: params.currency,
            description: params.description,
          },
          session,
        },
        { requireAccount: false },
      );

      return AccountModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async delete(id: string, session: SessionEntity): Promise<void> {
    try {
      await this.http.request(
        {
          path: `/api/accounts/${id}`,
          method: "DELETE",
          session,
        },
        { requireAccount: false },
      );
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
