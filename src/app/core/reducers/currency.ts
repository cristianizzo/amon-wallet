import { CurrencyModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { CurrencyActions } from '@app/core/actions';

export const featureKey = 'currency';
const initialState: CurrencyModel = null;

export const currencyReducer = createReducer(
  initialState,
  on(
    CurrencyActions.updateStateCurrency,
    (_: CurrencyModel = initialState, { currency }) => currency
  ),
);

export const reducer = (
  state: CurrencyModel | undefined,
  action: Action
): any => currencyReducer(state, action);
