import { createAction } from '@ngrx/store';
import { NetworkModel } from '@models/network.model';
import { type } from '@app/core/util';

export const networkActionTypes = {
  initNetworks: type('[Network] init network'),
  updateStateNetworks: type('[Network] update state networks'),
  switchNetwork: type('[Network] switch networks'),
};

export const initNetworks = createAction(networkActionTypes.initNetworks);

export const updateStateNetworks = createAction(
  networkActionTypes.updateStateNetworks,
  (networks: NetworkModel[]) => ({ networks })
);

export const switchNetwork = createAction(
  networkActionTypes.switchNetwork,
  (network: NetworkModel) => ({
    network,
  })
);
