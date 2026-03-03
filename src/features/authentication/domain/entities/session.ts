import { AbstractEntity } from "@/core/resources/entity";

interface SessionEntityConstructor {
  accessToken: string;
  selectedAccountId?: string;
}

export class SessionEntity implements AbstractEntity {
  public accessToken: string;
  public selectedAccountId?: string;

  constructor(args: SessionEntityConstructor) {
    this.accessToken = args.accessToken;
    this.selectedAccountId = args.selectedAccountId;
  }
}
