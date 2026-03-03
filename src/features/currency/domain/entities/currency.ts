import { AbstractEntity } from "@/core/resources/entity";

interface CurrencyEntityConstructor {
  code: string;
  name: string;
  symbol: string;
}

export class CurrencyEntity implements AbstractEntity {
  public code: string;
  public name: string;
  public symbol: string;

  constructor(args: CurrencyEntityConstructor) {
    this.code = args.code;
    this.name = args.name;
    this.symbol = args.symbol;
  }
}
