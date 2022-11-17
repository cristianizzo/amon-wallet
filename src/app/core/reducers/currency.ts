import { CurrencyModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { CurrencyActions } from '@app/core/actions';

export const featureKey = 'currencies';
const initialState: CurrencyModel[] = [];

export const currencyReducer = createReducer(
  initialState,
  on(
    CurrencyActions.updateStateCurrencies,
    (_: CurrencyModel[] = initialState, { currencies }) => currencies
  )
);

export const reducer = (
  state: CurrencyModel[] | undefined,
  action: Action
): any => currencyReducer(state, action);
