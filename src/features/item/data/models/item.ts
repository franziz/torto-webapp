import { AbstractModel } from "@/core/resources/model";
import { ItemEntity } from "@/features/item/domain/entities/item";
import { DateTime } from "luxon";

interface ItemModelConstructor {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export class ItemModel implements AbstractModel {
  public id: string;
  public name: string;
  public description?: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(args: ItemModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.description = args.description;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(doc: Record<string, any>): ItemModel {
    return new ItemModel({
      id: doc["id"],
      name: doc["name"],
      description: doc["description"],
      createdAt: doc["created_at"],
      updatedAt: doc["updated_at"],
    });
  }

  public toEntity(): ItemEntity {
    return new ItemEntity({
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: DateTime.fromISO(this.createdAt),
      updatedAt: DateTime.fromISO(this.updatedAt),
    });
  }
}
