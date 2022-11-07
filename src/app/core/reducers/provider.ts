import { ProviderModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { ProviderActions } from '@app/core/actions';

export const featureKey = 'providers';
const initialState: ProviderModel[] = [];

export const providerReducer = createReducer(
  initialState,
  on(ProviderActions.updateStateProviders, (state: ProviderModel[] = initialState, {providers}) => ([
    ...state, ...providers
  ])),
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

export const reducer = (state: ProviderModel[] | undefined, action: Action): any => providerReducer(state, action);
