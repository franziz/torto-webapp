import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

interface TransactionEntityConstructor {
  id: string;
  assetId: string;
  transactionTypeId: string;
  units: number;
  pricePerUnit: number;
  totalAmount: number;
  fee: number;
  currency: string;
  transactionDate: DateTime;
  notes?: string;
  transactionTypeCode?: string;
  transactionTypeName?: string;
  assetName?: string;
  assetTicker?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export class TransactionEntity implements AbstractEntity {
  public id: string;
  public assetId: string;
  public transactionTypeId: string;
  public units: number;
  public pricePerUnit: number;
  public totalAmount: number;
  public fee: number;
  public currency: string;
  public transactionDate: DateTime;
  public notes?: string;
  public transactionTypeCode?: string;
  public transactionTypeName?: string;
  public assetName?: string;
  public assetTicker?: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;

  constructor(args: TransactionEntityConstructor) {
    this.id = args.id;
    this.assetId = args.assetId;
    this.transactionTypeId = args.transactionTypeId;
    this.units = args.units;
    this.pricePerUnit = args.pricePerUnit;
    this.totalAmount = args.totalAmount;
    this.fee = args.fee;
    this.currency = args.currency;
    this.transactionDate = args.transactionDate;
    this.notes = args.notes;
    this.transactionTypeCode = args.transactionTypeCode;
    this.transactionTypeName = args.transactionTypeName;
    this.assetName = args.assetName;
    this.assetTicker = args.assetTicker;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
