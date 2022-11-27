import { Action, createReducer, on } from '@ngrx/store';
import { TokenActions } from '@app/core/actions';
import { TokenStateModel } from '@core/models';

export const featureKey = 'tokens';
const initialState: TokenStateModel = {
  loadingBalances: false,
  loading: false,
  current: [],
  all: [],
};

export const tokenReducer = createReducer(
  initialState,
  on(TokenActions.updateStateTokens, (state = initialState, { tokens }) => ({
    ...state,
    ...{
      current: tokens,
      all: state.all.map((c) =>
        Object.assign({}, c, {
          selected: tokens.find((w) => w.address === c.address),
        })
      ),
    },
  })),

  on(TokenActions.getAllTokensSuccess, (state = initialState, { tokens }) => ({
    ...state,
    ...{ all: tokens },
  })),
  on(TokenActions.resetTokens, (state = initialState) => ({
    ...state,
    ...{ all: [] },
  })),

  on(TokenActions.addTokenToState, (state = initialState, { token }) => ({
    ...state,
    ...{
      current: [...state.current, token],
    },
  })),
  on(TokenActions.updateTokenToState, (state = initialState, { token }) => ({
    ...state,
    ...{
      current: [...state.current].map((tk) => {
        if (tk.address === token.address) {
          return Object.assign({}, tk, token);
        }
        return tk;
      }),
      all: [...state.all].map((tk) => {
        if (tk.address === token.address) {
          return Object.assign({}, tk, token);
        }
        return tk;
      }),
    },
  })),
  on(TokenActions.resetState, (state = initialState) => ({
    ...state,
    ...{
      current: [],
      all: [],
    },
  })),
  on(
    TokenActions.setLoading,
    (state = initialState, { loading, loadingBalances }) => ({
      ...state,
      ...{
        loading,
        loadingBalances,
      },
    })
  )
);

export const reducer = (state = initialState, action: Action): any =>
  tokenReducer(state, action);
