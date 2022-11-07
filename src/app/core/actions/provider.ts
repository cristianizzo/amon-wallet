import { createAction } from '@ngrx/store';
import { ProviderModel } from '@models/provider.model';
import { type } from '@app/core/util';

export const providerActionTypes = {
  initProviders: type('[Provider] init provider'),
  updateStateProviders: type('[Provider] update state providers'),
  providerError: type('[Provider] provider error'),
};

export const initProviders = createAction(
  providerActionTypes.initProviders,
);

export const updateStateProviders = createAction(
  providerActionTypes.updateStateProviders,
  (providers: ProviderModel[]) => ({providers})
);

export const providerError = createAction(
  providerActionTypes.providerError,
  (error: any) => ({error})
);

// export const addProvider = createAction(
//   '[Provider] add provider',
//   (provider: ProviderModel) => ({provider})
// );

// export const switchProvider = createAction(
//   '[Provider] switch provider',
//   (provider: ProviderModel) => ({provider})
// );

// export const deleteProvider = createAction(
//   '[Provider] delete provider',
//   (provider: ProviderModel) => ({provider})
// );

