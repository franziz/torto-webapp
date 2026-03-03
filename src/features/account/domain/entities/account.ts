import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

interface AccountEntityConstructor {
  id: string;
  name: string;
  country: string;
  currency: string;
  description?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export class AccountEntity implements AbstractEntity {
  public id: string;
  public name: string;
  public country: string;
  public currency: string;
  public description?: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;

  constructor(args: AccountEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.country = args.country;
    this.currency = args.currency;
    this.description = args.description;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
