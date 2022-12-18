import { TokenModel } from '@app/models';

export interface TokenStateModel {
  loadingBalances: boolean;
  loading: boolean;
  current: TokenModel[];
  all: TokenModel[];
}
