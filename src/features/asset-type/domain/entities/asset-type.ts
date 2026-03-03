import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

interface AssetTypeEntityConstructor {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export class AssetTypeEntity implements AbstractEntity {
  public id: string;
  public code: string;
  public name: string;
  public description?: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;

  constructor(args: AssetTypeEntityConstructor) {
    this.id = args.id;
    this.code = args.code;
    this.name = args.name;
    this.description = args.description;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
