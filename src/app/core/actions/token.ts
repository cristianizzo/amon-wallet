import { createAction } from '@ngrx/store';
import { TokenModel } from '@models/token.model';
import { type } from '@app/core/util';

export const tokenActionTypes = {
  initTokens: type('[Token] init token'),
  addToken: type('[Token] add token'),
  updateToken: type('[Token] update token'),
  selectToken: type('[Token] select token'),
  unselectToken: type('[Token] unselect token'),
  addTokenToState: type('[Token] add token state'),
  updateTokenToState: type('[Token] update token state'),
  updateStateTokens: type('[Token] update state tokens'),
  resetState: type('[Token] reset state'),

  getAllTokens: type('[Token] get all tokens'),
  getAllTokensSuccess: type('[Token] get all tokens success'),
  resetTokens: type('[Token] reset tokens'),
};

export const initTokens = createAction(tokenActionTypes.initTokens);

export const getAllTokens = createAction(tokenActionTypes.getAllTokens);

export const getAllTokensSuccess = createAction(
  tokenActionTypes.getAllTokensSuccess,
  (tokens: TokenModel[]) => ({ tokens })
);

export const resetTokens = createAction(tokenActionTypes.resetTokens);

export const addToken = createAction(
  tokenActionTypes.addToken,
  (address: string) => ({ address })
);

export const updateToken = createAction(
  tokenActionTypes.updateToken,
  (address: string, { symbol, name, decimals }) => ({
    address,
    symbol,
    name,
    decimals,
  })
);

export const selectToken = createAction(
  tokenActionTypes.selectToken,
  (address: string) => ({ address })
);

export const unselectToken = createAction(
  tokenActionTypes.unselectToken,
  (address: string) => ({ address })
);

export const addTokenToState = createAction(
  tokenActionTypes.addTokenToState,
  (token: TokenModel) => ({ token })
);

export const updateTokenToState = createAction(
  tokenActionTypes.updateTokenToState,
  (token: TokenModel) => ({ token })
);

export const updateStateTokens = createAction(
  tokenActionTypes.updateStateTokens,
  (tokens: TokenModel[]) => ({ tokens })
);

export const resetState = createAction(tokenActionTypes.resetState);
