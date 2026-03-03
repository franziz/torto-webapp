import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

interface ItemEntityConstructor {
  id: string;
  name: string;
  description?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export class ItemEntity implements AbstractEntity {
  public id: string;
  public name: string;
  public description?: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;

  constructor(args: ItemEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.description = args.description;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
