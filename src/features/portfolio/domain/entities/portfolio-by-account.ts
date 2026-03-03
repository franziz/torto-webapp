import { AbstractEntity } from "@/core/resources/entity";

interface PortfolioByAccountEntityConstructor {
  accountId: string;
  accountName: string;
  accountCountry: string;
  currency: string;
  totalCost: number;
  currentValue: number;
  unrealizedGain: number;
  realizedGain: number;
}

export class PortfolioByAccountEntity implements AbstractEntity {
  public accountId: string;
  public accountName: string;
  public accountCountry: string;
  public currency: string;
  public totalCost: number;
  public currentValue: number;
  public unrealizedGain: number;
  public realizedGain: number;

  constructor(args: PortfolioByAccountEntityConstructor) {
    this.accountId = args.accountId;
    this.accountName = args.accountName;
    this.accountCountry = args.accountCountry;
    this.currency = args.currency;
    this.totalCost = args.totalCost;
    this.currentValue = args.currentValue;
    this.unrealizedGain = args.unrealizedGain;
    this.realizedGain = args.realizedGain;
  }
}
