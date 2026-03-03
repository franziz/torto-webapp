import { AbstractModel } from "@/core/resources/model";
import { TransactionTypeEntity } from "@/features/transaction-type/domain/entities/transaction-type";
import { DateTime } from "luxon";

interface TransactionTypeModelConstructor {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export class TransactionTypeModel implements AbstractModel {
  public id: string;
  public code: string;
  public name: string;
  public description?: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(args: TransactionTypeModelConstructor) {
    this.id = args.id;
    this.code = args.code;
    this.name = args.name;
    this.description = args.description;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(doc: Record<string, any>): TransactionTypeModel {
    return new TransactionTypeModel({
      id: doc["id"],
      code: doc["code"],
      name: doc["name"],
      description: doc["description"],
      createdAt: doc["created_at"],
      updatedAt: doc["updated_at"],
    });
  }

  public toEntity(): TransactionTypeEntity {
    return new TransactionTypeEntity({
      id: this.id,
      code: this.code,
      name: this.name,
      description: this.description,
      createdAt: DateTime.fromISO(this.createdAt),
      updatedAt: DateTime.fromISO(this.updatedAt),
    });
  }
}
