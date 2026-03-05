import { AbstractModel } from "@/core/resources/model";
import { PortfolioConvertedSummaryEntity } from "@/features/portfolio/domain/entities/portfolio-converted-summary";

export class PortfolioConvertedSummaryModel implements AbstractModel {
  public currency: string;
  public totalCost: number;
  public currentValue: number | null;
  public unrealizedGain: number | null;
  public realizedGain: number;
  public totalDividends: number;
  public totalInterest: number;

  public positionCount: number;
  public exchangeRatesUsed: Record<string, number>;

  constructor(args: {
    currency: string;
    totalCost: number;
    currentValue: number | null;
    unrealizedGain: number | null;
    realizedGain: number;
    totalDividends: number;
    totalInterest: number;

    positionCount: number;
    exchangeRatesUsed: Record<string, number>;
  }) {
    this.currency = args.currency;
    this.totalCost = args.totalCost;
    this.currentValue = args.currentValue;
    this.unrealizedGain = args.unrealizedGain;
    this.realizedGain = args.realizedGain;
    this.totalDividends = args.totalDividends;
    this.totalInterest = args.totalInterest;

    this.positionCount = args.positionCount;
    this.exchangeRatesUsed = args.exchangeRatesUsed;
  }

  public static fromJson(doc: Record<string, any>): PortfolioConvertedSummaryModel {
    return new PortfolioConvertedSummaryModel({
      currency: doc["currency"],
      totalCost: Number(doc["total_cost"]),
      currentValue: doc["current_value"] != null ? Number(doc["current_value"]) : null,
      unrealizedGain: doc["unrealized_gain"] != null ? Number(doc["unrealized_gain"]) : null,
      realizedGain: Number(doc["realized_gain"]),
      totalDividends: Number(doc["total_dividends"]),
      totalInterest: Number(doc["total_interest"]),

      positionCount: Number(doc["position_count"]),
      exchangeRatesUsed: doc["exchange_rates_used"] ?? {},
    });
  }

  public toEntity(): PortfolioConvertedSummaryEntity {
    return new PortfolioConvertedSummaryEntity({
      currency: this.currency,
      totalCost: this.totalCost,
      currentValue: this.currentValue,
      unrealizedGain: this.unrealizedGain,
      realizedGain: this.realizedGain,
      totalDividends: this.totalDividends,
      totalInterest: this.totalInterest,

      positionCount: this.positionCount,
      exchangeRatesUsed: this.exchangeRatesUsed,
    });
  }
}
