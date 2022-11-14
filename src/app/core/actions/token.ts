import { createAction } from '@ngrx/store';
import { TokenModel } from '@models/token.model';
import { type } from '@app/core/util';
import { CurrencyModel, ProviderModel, WalletModel } from '@app/models';

export const tokenActionTypes = {
  initTokens: type('[Token] init token'),
  addToken: type('[Token] add new token'),
  selectToken: type('[Token] select token'),
  unselectToken: type('[Token] unselect token'),
  addTokenToState: type('[Token] add token state'),
  updateTokenToState: type('[Token] update token state'),
  updateStateTokens: type('[Token] update state tokens'),
  resetState: type('[Token] reset state'),
  reloadTokens: type('[Token] reload tokens'),
  tokenError: type('[Token] token error'),
};

export const initTokens = createAction(
  tokenActionTypes.initTokens,
  (provider: ProviderModel, currency: CurrencyModel, wallet?: WalletModel) => ({
    provider,
    currency,
    wallet,
  })
);

export const addToken = createAction(
  tokenActionTypes.addToken,
  (
    address: string,
    wallet: WalletModel,
    provider: ProviderModel,
    currency: CurrencyModel
  ) => ({
    address,
    wallet,
    provider,
    currency,
  })
);

export const selectToken = createAction(
  tokenActionTypes.selectToken,
  (
    address: string,
    wallet: WalletModel,
    provider: ProviderModel,
    currency: CurrencyModel
  ) => ({
    address,
    wallet,
    provider,
    currency,
  })
);

export const unselectToken = createAction(
  tokenActionTypes.unselectToken,
  (address: string, provider: ProviderModel) => ({ address, provider })
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

export const reloadTokens = createAction(
  tokenActionTypes.reloadTokens,
  (provider: ProviderModel, currency: CurrencyModel, wallet?: WalletModel) => ({
    provider,
    currency,
    wallet,
  })
);

export const resetState = createAction(tokenActionTypes.resetState);

export const tokenError = createAction(
  tokenActionTypes.tokenError,
  (error: any) => ({ error })
);

// export const switchToken = createAction(
//   '[Token] switch token',
//   (token: TokenModel) => ({token})
// );

// export const deleteToken = createAction(
//   '[Token] delete token',
//   (token: TokenModel) => ({token})
// );
