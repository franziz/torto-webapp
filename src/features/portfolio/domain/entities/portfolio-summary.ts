import { AbstractEntity } from "@/core/resources/entity";

interface PortfolioSummaryEntityConstructor {
  totalCost: number;
  currentValue: number;
  unrealizedGain: number;
  realizedGain: number;
  totalDividends: number;
  totalInterest: number;
  totalFees: number;
  currency: string;
}

export class PortfolioSummaryEntity implements AbstractEntity {
  public totalCost: number;
  public currentValue: number;
  public unrealizedGain: number;
  public realizedGain: number;
  public totalDividends: number;
  public totalInterest: number;
  public totalFees: number;
  public currency: string;

  constructor(args: PortfolioSummaryEntityConstructor) {
    this.totalCost = args.totalCost;
    this.currentValue = args.currentValue;
    this.unrealizedGain = args.unrealizedGain;
    this.realizedGain = args.realizedGain;
    this.totalDividends = args.totalDividends;
    this.totalInterest = args.totalInterest;
    this.totalFees = args.totalFees;
    this.currency = args.currency;
  }
}
