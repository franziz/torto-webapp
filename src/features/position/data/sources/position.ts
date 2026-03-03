import { PositionService, ListPositionsServiceFilter } from "@/features/position/domain/sources/position";
import { PositionModel } from "@/features/position/data/models/position";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class PositionServiceImpl implements PositionService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    filter: ListPositionsServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: PositionModel[]; meta: PaginationMetaModel }> {
    try {
      const searchParams: Record<string, string> = {};
      if (filter.page) searchParams.page = String(filter.page);
      if (filter.limit) searchParams.limit = String(filter.limit);

      const result = await this.http.request(
        {
          path: "/api/positions",
          method: "GET",
          searchParams,
          session,
        },
        { requireAccount: false },
      );

      return {
        data: (result.data ?? []).map((item: Record<string, any>) => PositionModel.fromJson(item)),
        meta: PaginationMetaModel.fromJson(result.meta ?? {}),
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
