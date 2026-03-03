import { AbstractEntity } from "@/core/resources/entity";

interface PortfolioByCountryEntityConstructor {
  country: string;
  totalCost: number;
  currentValue: number;
  unrealizedGain: number;
  realizedGain: number;
}

export class PortfolioByCountryEntity implements AbstractEntity {
  public country: string;
  public totalCost: number;
  public currentValue: number;
  public unrealizedGain: number;
  public realizedGain: number;

  constructor(args: PortfolioByCountryEntityConstructor) {
    this.country = args.country;
    this.totalCost = args.totalCost;
    this.currentValue = args.currentValue;
    this.unrealizedGain = args.unrealizedGain;
    this.realizedGain = args.realizedGain;
  }
}
