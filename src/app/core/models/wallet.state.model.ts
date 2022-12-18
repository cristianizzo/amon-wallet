import { WalletModel } from '@app/models';

export interface WalletStateModel {
  loadingBalance: boolean;
  loading: boolean;
  current: WalletModel;
  all: WalletModel[];
}
