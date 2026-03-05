import { CurrencyService } from "@/features/currency/domain/sources/currency";
import { CurrencyModel } from "@/features/currency/data/models/currency";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class CurrencyServiceImpl implements CurrencyService {
  constructor(private readonly http: HttpRequest) {}

  public async list(session: SessionEntity): Promise<CurrencyModel[]> {
    try {
      const result = await this.http.request(
        {
          path: "/api/currencies",
          method: "GET",
          session,
        },

      );
      const data = result && Array.isArray(result.data) ? result.data : [];
      return data.map((item: Record<string, any>) => CurrencyModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
