import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export abstract class SessionRepository {
  public abstract retrieve(): Promise<DataState<SessionEntity>>;
  public abstract signOut(): Promise<DataState<void>>;
}
