import { CurrencyStateModel } from '@core/models';
import { Action, createReducer, on } from '@ngrx/store';
import { CurrencyActions } from '@app/core/actions';

export const featureKey = 'currency';
const initialState: CurrencyStateModel = {
  loading: false,
  current: null,
  all: [],
};

export const currencyReducer = createReducer(
  initialState,
  on(
    CurrencyActions.updateStateCurrency,
    (state = initialState, { currency }) => ({
      ...state,
      ...{
        current: currency,
        all: state.all.map((c) =>
          Object.assign({}, c, {
            selected: c.symbol === currency.symbol,
          })
        ),
      },
    })
  ),
  on(
    CurrencyActions.getAllCurrenciesSuccess,
    (state = initialState, { currencies }) => ({
      ...state,
      ...{ all: currencies },
    })
  ),
  on(CurrencyActions.resetCurrencies, (state = initialState) => ({
    ...state,
    ...{ all: [] },
  })),
  on(CurrencyActions.setLoading, (state = initialState, { loading }) => ({
    ...state,
    ...{
      loading,
    },
  }))
);

export const reducer = (state = initialState, action: Action): any =>
  currencyReducer(state, action);
