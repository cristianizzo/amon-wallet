import { ChainModel } from '@app/models';

export interface ChainStateModel {
  loading: boolean;
  current: ChainModel;
  all: ChainModel[];
}
