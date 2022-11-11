import { createAction } from '@ngrx/store';
import { TokenModel } from '@models/token.model';
import { type } from '@app/core/util';
import { CurrencyModel, ProviderModel, WalletModel } from '@app/models';

export const tokenActionTypes = {
  initTokens: type('[Token] init token'),
  addToken: type('[Token] add token'),
  updateStateTokens: type('[Token] update state tokens'),
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

export const updateStateTokens = createAction(
  tokenActionTypes.updateStateTokens,
  (tokens: TokenModel[]) => ({ tokens })
);

export const tokenError = createAction(
  tokenActionTypes.tokenError,
  (error: any) => ({ error })
);

export const addToken = createAction(
  tokenActionTypes.addToken,
  (token: TokenModel, wallet: WalletModel) => ({ token, wallet })
);

export const addTokenToState = createAction(
  tokenActionTypes.addToken,
  (token: TokenModel) => ({ token })
);

// export const switchToken = createAction(
//   '[Token] switch token',
//   (token: TokenModel) => ({token})
// );

// export const deleteToken = createAction(
//   '[Token] delete token',
//   (token: TokenModel) => ({token})
// );
