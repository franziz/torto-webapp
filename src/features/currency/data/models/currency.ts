import { AbstractModel } from "@/core/resources/model";
import { CurrencyEntity } from "@/features/currency/domain/entities/currency";

export class CurrencyModel implements AbstractModel {
  public code: string;
  public name: string;
  public symbol: string;

  constructor(args: { code: string; name: string; symbol: string }) {
    this.code = args.code;
    this.name = args.name;
    this.symbol = args.symbol;
  }

  public static fromJson(doc: Record<string, any>): CurrencyModel {
    return new CurrencyModel({
      code: doc["code"],
      name: doc["name"],
      symbol: doc["symbol"],
    });
  }

  public toEntity(): CurrencyEntity {
    return new CurrencyEntity({
      code: this.code,
      name: this.name,
      symbol: this.symbol,
    });
  }
}
