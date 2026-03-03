import { AbstractModel } from "@/core/resources/model";
import { TransactionEntity } from "@/features/transaction/domain/entities/transaction";
import { DateTime } from "luxon";

interface TransactionModelConstructor {
  id: string;
  assetId: string;
  transactionTypeId: string;
  units: number;
  pricePerUnit: number;
  totalAmount: number;
  fee: number;
  currency: string;
  transactionDate: string;
  notes?: string;
  transactionTypeCode?: string;
  transactionTypeName?: string;
  assetName?: string;
  assetTicker?: string;
  createdAt: string;
  updatedAt: string;
}

export class TransactionModel implements AbstractModel {
  public id: string;
  public assetId: string;
  public transactionTypeId: string;
  public units: number;
  public pricePerUnit: number;
  public totalAmount: number;
  public fee: number;
  public currency: string;
  public transactionDate: string;
  public notes?: string;
  public transactionTypeCode?: string;
  public transactionTypeName?: string;
  public assetName?: string;
  public assetTicker?: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(args: TransactionModelConstructor) {
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

  public static fromJson(doc: Record<string, any>): TransactionModel {
    return new TransactionModel({
      id: doc["id"],
      assetId: doc["asset_id"],
      transactionTypeId: doc["transaction_type_id"],
      units: Number(doc["units"]),
      pricePerUnit: Number(doc["price_per_unit"]),
      totalAmount: Number(doc["total_amount"]),
      fee: Number(doc["fee"]),
      currency: doc["currency"],
      transactionDate: doc["transaction_date"],
      notes: doc["notes"],
      transactionTypeCode: doc["transaction_type_code"],
      transactionTypeName: doc["transaction_type_name"],
      assetName: doc["asset_name"],
      assetTicker: doc["asset_ticker"],
      createdAt: doc["created_at"],
      updatedAt: doc["updated_at"],
    });
  }

  public toEntity(): TransactionEntity {
    return new TransactionEntity({
      id: this.id,
      assetId: this.assetId,
      transactionTypeId: this.transactionTypeId,
      units: this.units,
      pricePerUnit: this.pricePerUnit,
      totalAmount: this.totalAmount,
      fee: this.fee,
      currency: this.currency,
      transactionDate: DateTime.fromISO(this.transactionDate),
      notes: this.notes,
      transactionTypeCode: this.transactionTypeCode,
      transactionTypeName: this.transactionTypeName,
      assetName: this.assetName,
      assetTicker: this.assetTicker,
      createdAt: DateTime.fromISO(this.createdAt),
      updatedAt: DateTime.fromISO(this.updatedAt),
    });
  }
}
