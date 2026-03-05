import {
  TransactionTypeService,
  ListTransactionTypesServiceFilter,
} from "@/features/transaction-type/domain/sources/transaction-type";
import { TransactionTypeModel } from "@/features/transaction-type/data/models/transaction-type";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class TransactionTypeServiceImpl implements TransactionTypeService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    filter: ListTransactionTypesServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: TransactionTypeModel[]; meta: PaginationMetaModel }> {
    try {
      const searchParams: Record<string, string> = {};
      if (filter.page) searchParams.page = String(filter.page);
      if (filter.limit) searchParams.limit = String(filter.limit);

      const result = await this.http.request(
        {
          path: "/api/transaction-types",
          method: "GET",
          searchParams,
          session,
        },

      );

      return {
        data: (result.data ?? []).map((item: Record<string, any>) => TransactionTypeModel.fromJson(item)),
        meta: PaginationMetaModel.fromJson(result.meta ?? {}),
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
