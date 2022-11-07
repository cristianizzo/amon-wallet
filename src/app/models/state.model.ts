import {WalletModel} from '@models/wallet.model';
import {ProviderModel} from '@models/provider.model';

export interface StateModel {
  readonly password?: string;
  readonly providers?: ProviderModel[];
  readonly wallets?: WalletModel[];
}
