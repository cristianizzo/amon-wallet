import { CurrencyModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { CurrencyActions } from '@app/core/actions';

export const featureKey = 'currencies';
const initialState: CurrencyModel[] = [];

export const currencyReducer = createReducer(
  initialState,
  on(
    CurrencyActions.updateStateCurrencies,
    (state: CurrencyModel[] = initialState, { currencies }) => [
      ...state,
      ...currencies,
    ]
  )
  // on(ProviderActions.addProvider, (state: ProviderModel[] = initialState, {provider}) => ([
  //   ...state, provider // increase provider id
  // ])),
  // on(ProviderActions.deleteProvider, (state: ProviderModel[] = initialState, {provider}) =>
  //   state.filter(p => p.id !== provider.id)
  // ),
  // on(ProviderActions.switchProvider, (state: ProviderModel[] = initialState, {provider}) =>
  //   state.map(p => Object.assign({}, p, {
  //     default: p.id === provider.id
  //   }))
  // ),
);

export const reducer = (
  state: CurrencyModel[] | undefined,
  action: Action
): any => currencyReducer(state, action);
