import { AbstractModel } from "@/core/resources/model";
import { AccountEntity } from "@/features/account/domain/entities/account";
import { DateTime } from "luxon";

interface AccountModelConstructor {
  id: string;
  name: string;
  country: string;
  currency: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export class AccountModel implements AbstractModel {
  public id: string;
  public name: string;
  public country: string;
  public currency: string;
  public description?: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(args: AccountModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.country = args.country;
    this.currency = args.currency;
    this.description = args.description;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(doc: Record<string, any>): AccountModel {
    return new AccountModel({
      id: doc["id"],
      name: doc["name"],
      country: doc["country"],
      currency: doc["currency"],
      description: doc["description"],
      createdAt: doc["created_at"],
      updatedAt: doc["updated_at"],
    });
  }

  public toEntity(): AccountEntity {
    return new AccountEntity({
      id: this.id,
      name: this.name,
      country: this.country,
      currency: this.currency,
      description: this.description,
      createdAt: DateTime.fromISO(this.createdAt),
      updatedAt: DateTime.fromISO(this.updatedAt),
    });
  }
}
