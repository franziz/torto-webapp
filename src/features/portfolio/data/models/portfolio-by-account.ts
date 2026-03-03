import { AbstractModel } from "@/core/resources/model";
import { PortfolioByAccountEntity } from "@/features/portfolio/domain/entities/portfolio-by-account";

export class PortfolioByAccountModel implements AbstractModel {
  public accountId: string;
  public accountName: string;
  public accountCountry: string;
  public currency: string;
  public totalCost: number;
  public currentValue: number;
  public unrealizedGain: number;
  public realizedGain: number;

  constructor(args: {
    accountId: string;
    accountName: string;
    accountCountry: string;
    currency: string;
    totalCost: number;
    currentValue: number;
    unrealizedGain: number;
    realizedGain: number;
  }) {
    this.accountId = args.accountId;
    this.accountName = args.accountName;
    this.accountCountry = args.accountCountry;
    this.currency = args.currency;
    this.totalCost = args.totalCost;
    this.currentValue = args.currentValue;
    this.unrealizedGain = args.unrealizedGain;
    this.realizedGain = args.realizedGain;
  }

  public static fromJson(doc: Record<string, any>): PortfolioByAccountModel {
    return new PortfolioByAccountModel({
      accountId: doc["account_id"],
      accountName: doc["account_name"],
      accountCountry: doc["account_country"],
      currency: doc["currency"],
      totalCost: Number(doc["total_cost"]),
      currentValue: Number(doc["current_value"]),
      unrealizedGain: Number(doc["unrealized_gain"]),
      realizedGain: Number(doc["realized_gain"]),
    });
  }

  public toEntity(): PortfolioByAccountEntity {
    return new PortfolioByAccountEntity({
      accountId: this.accountId,
      accountName: this.accountName,
      accountCountry: this.accountCountry,
      currency: this.currency,
      totalCost: this.totalCost,
      currentValue: this.currentValue,
      unrealizedGain: this.unrealizedGain,
      realizedGain: this.realizedGain,
    });
  }
}
