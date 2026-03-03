import { AbstractEntity } from "@/core/resources/entity";

interface PortfolioConvertedSummaryEntityConstructor {
  currency: string;
  totalCost: number;
  currentValue: number | null;
  unrealizedGain: number | null;
  realizedGain: number;
  totalDividends: number;
  totalInterest: number;
  totalFees: number;
  positionCount: number;
  exchangeRatesUsed: Record<string, number>;
}

export class PortfolioConvertedSummaryEntity implements AbstractEntity {
  public currency: string;
  public totalCost: number;
  public currentValue: number | null;
  public unrealizedGain: number | null;
  public realizedGain: number;
  public totalDividends: number;
  public totalInterest: number;
  public totalFees: number;
  public positionCount: number;
  public exchangeRatesUsed: Record<string, number>;

  constructor(args: PortfolioConvertedSummaryEntityConstructor) {
    this.currency = args.currency;
    this.totalCost = args.totalCost;
    this.currentValue = args.currentValue;
    this.unrealizedGain = args.unrealizedGain;
    this.realizedGain = args.realizedGain;
    this.totalDividends = args.totalDividends;
    this.totalInterest = args.totalInterest;
    this.totalFees = args.totalFees;
    this.positionCount = args.positionCount;
    this.exchangeRatesUsed = args.exchangeRatesUsed;
  }
}
