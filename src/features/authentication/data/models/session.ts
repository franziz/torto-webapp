import { AbstractModel } from "@/core/resources/model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

interface SessionModelConstructor {
  accessToken: string;
  selectedAccountId?: string;
}

export class SessionModel implements AbstractModel {
  public accessToken: string;
  public selectedAccountId?: string;

  constructor(args: SessionModelConstructor) {
    this.accessToken = args.accessToken;
    this.selectedAccountId = args.selectedAccountId;
  }

  public static fromJson(doc: Record<string, any>): SessionModel {
    return new SessionModel({
      accessToken: doc["access_token"],
      selectedAccountId: doc["selected_account_id"],
    });
  }

  public toEntity(): SessionEntity {
    return new SessionEntity({
      accessToken: this.accessToken,
      selectedAccountId: this.selectedAccountId,
    });
  }
}
