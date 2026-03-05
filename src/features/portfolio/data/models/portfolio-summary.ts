import { AbstractModel } from "@/core/resources/model";
import { PortfolioSummaryEntity } from "@/features/portfolio/domain/entities/portfolio-summary";

export class PortfolioSummaryModel implements AbstractModel {
  public totalCost: number;
  public currentValue: number;
  public unrealizedGain: number;
  public realizedGain: number;
  public totalDividends: number;
  public totalInterest: number;

  public currency: string;

  constructor(args: {
    totalCost: number;
    currentValue: number;
    unrealizedGain: number;
    realizedGain: number;
    totalDividends: number;
    totalInterest: number;

    currency: string;
  }) {
    this.totalCost = args.totalCost;
    this.currentValue = args.currentValue;
    this.unrealizedGain = args.unrealizedGain;
    this.realizedGain = args.realizedGain;
    this.totalDividends = args.totalDividends;
    this.totalInterest = args.totalInterest;

    this.currency = args.currency;
  }

  public static fromJson(doc: Record<string, any>): PortfolioSummaryModel {
    return new PortfolioSummaryModel({
      totalCost: Number(doc["total_cost"]),
      currentValue: Number(doc["current_value"]),
      unrealizedGain: Number(doc["unrealized_gain"]),
      realizedGain: Number(doc["realized_gain"]),
      totalDividends: Number(doc["total_dividends"]),
      totalInterest: Number(doc["total_interest"]),

      currency: doc["currency"],
    });
  }

  public toEntity(): PortfolioSummaryEntity {
    return new PortfolioSummaryEntity({
      totalCost: this.totalCost,
      currentValue: this.currentValue,
      unrealizedGain: this.unrealizedGain,
      realizedGain: this.realizedGain,
      totalDividends: this.totalDividends,
      totalInterest: this.totalInterest,

      currency: this.currency,
    });
  }
}
