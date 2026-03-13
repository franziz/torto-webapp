import { AbstractModel } from "@/core/resources/model";
import { AssetTypeEntity } from "@/features/asset-type/domain/entities/asset-type";
import { DateTime } from "luxon";

interface AssetTypeModelConstructor {
  id: string;
  code: string;
  name: string;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export class AssetTypeModel implements AbstractModel {
  public id: string;
  public code: string;
  public name: string;
  public category: string;
  public description?: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(args: AssetTypeModelConstructor) {
    this.id = args.id;
    this.code = args.code;
    this.name = args.name;
    this.category = args.category;
    this.description = args.description;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(doc: Record<string, any>): AssetTypeModel {
    return new AssetTypeModel({
      id: doc["id"],
      code: doc["code"],
      name: doc["name"],
      category: doc["category"],
      description: doc["description"],
      createdAt: doc["created_at"],
      updatedAt: doc["updated_at"],
    });
  }

  public toEntity(): AssetTypeEntity {
    return new AssetTypeEntity({
      id: this.id,
      code: this.code,
      name: this.name,
      category: this.category,
      description: this.description,
      createdAt: DateTime.fromISO(this.createdAt),
      updatedAt: DateTime.fromISO(this.updatedAt),
    });
  }
}
