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
  ),
  on(
    CurrencyActions.switchCurrency,
    (state: CurrencyModel[] = initialState, { currency }) => [
      ...state.map((c) =>
        Object.assign({}, c, {
          selected: c.symbol === currency.symbol,
        })
      ),
    ]
  )
);

export const reducer = (
  state: CurrencyModel[] | undefined,
  action: Action
): any => currencyReducer(state, action);
