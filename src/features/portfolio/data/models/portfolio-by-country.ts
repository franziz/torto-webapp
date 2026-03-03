import { AbstractModel } from "@/core/resources/model";
import { PortfolioByCountryEntity } from "@/features/portfolio/domain/entities/portfolio-by-country";

export class PortfolioByCountryModel implements AbstractModel {
  public country: string;
  public totalCost: number;
  public currentValue: number;
  public unrealizedGain: number;
  public realizedGain: number;

  constructor(args: {
    country: string;
    totalCost: number;
    currentValue: number;
    unrealizedGain: number;
    realizedGain: number;
  }) {
    this.country = args.country;
    this.totalCost = args.totalCost;
    this.currentValue = args.currentValue;
    this.unrealizedGain = args.unrealizedGain;
    this.realizedGain = args.realizedGain;
  }

  public static fromJson(doc: Record<string, any>): PortfolioByCountryModel {
    return new PortfolioByCountryModel({
      country: doc["country"],
      totalCost: Number(doc["total_cost"]),
      currentValue: Number(doc["current_value"]),
      unrealizedGain: Number(doc["unrealized_gain"]),
      realizedGain: Number(doc["realized_gain"]),
    });
  }

  public toEntity(): PortfolioByCountryEntity {
    return new PortfolioByCountryEntity({
      country: this.country,
      totalCost: this.totalCost,
      currentValue: this.currentValue,
      unrealizedGain: this.unrealizedGain,
      realizedGain: this.realizedGain,
    });
  }
}
