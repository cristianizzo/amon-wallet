import { createAction } from '@ngrx/store';
import { ProviderModel } from '@models/provider.model';
import { type } from '@app/core/util';
import { CurrencyModel, WalletModel } from '@app/models';

export const providerActionTypes = {
  initProviders: type('[Provider] init provider'),
  updateStateProviders: type('[Provider] update state providers'),
  switchProvider: type('[Provider] switch providers'),
  providerError: type('[Provider] provider error'),
};

export const initProviders = createAction(providerActionTypes.initProviders);

export const updateStateProviders = createAction(
  providerActionTypes.updateStateProviders,
  (providers: ProviderModel[]) => ({ providers })
);

export const switchProvider = createAction(
  providerActionTypes.switchProvider,
  (provider: ProviderModel, currency: CurrencyModel, wallet: WalletModel) => ({
    provider,
    currency,
    wallet,
  })
);

export const providerError = createAction(
  providerActionTypes.providerError,
  (error: any) => ({ error })
);

// export const addProvider = createAction(
//   '[Provider] add provider',
//   (provider: ProviderModel) => ({provider})
// );

// export const deleteProvider = createAction(
//   '[Provider] delete provider',
//   (provider: ProviderModel) => ({provider})
// );
