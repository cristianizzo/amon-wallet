import { Injectable } from '@angular/core';
import { ChainModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { LocalForageService } from '@services/localforage.service';

@Injectable()
export class ChainService {
  constructor(
    private utilsHelper: UtilsHelper,
    private localForageService: LocalForageService
  ) {}

  public async getCustomChainsFromStorage(): Promise<ChainModel[]> {
    const dbChains = (await this.localForageService.getItem('chains')) || [];
    return dbChains;
  }

  public async saveCustomChainToStorage(chain: ChainModel) {
    const dbChains = await this.getCustomChainsFromStorage();
    const newChains = [...dbChains, chain];
    await this.localForageService.setItem('chains', newChains);
    return newChains;
  }

  public async getSelectedChainFromStorage() {
    const dbChain = (await this.localForageService.getItem('chain')) || null;
    return dbChain;
  }

  public async saveSelectedChainToStorage(chain: ChainModel) {
    await this.localForageService.setItem('chain', chain);
  }
}
