import { CurrencyEntity } from "@/features/currency/domain/entities/currency";
import { ServerError } from "@/core/resources/server-error";

type InitialState = { currencies: null; loading: true; error: null };
type LoadedState = { currencies: CurrencyEntity[]; loading: false; error: null };
type ErrorState = { currencies: null; loading: false; error: ServerError };

export type UseListCurrenciesReturnType = InitialState | LoadedState | ErrorState;
