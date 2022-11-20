import { Injectable } from '@angular/core';
import { ChainModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { ChainService } from '../chain.service';
import { from, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Web3Services } from '@services/web3.service';
import assert from 'assert';

@Injectable()
export class ChainProxy {
  constructor(
    private utilsHelper: UtilsHelper,
    private chainService: ChainService,
    private web3Services: Web3Services
  ) {}

  public initChain(): Observable<ChainModel> {
    return from(
      this.utilsHelper.async(async () => {
        let dbChain = await this.chainService.getSelectedChainFromStorage();

        if (!dbChain) {
          const defaultChains = this.utilsHelper.chainsJson;

          dbChain = defaultChains.find(
            (p) =>
              p.symbol === environment.defaultChain &&
              p.chainId === environment.defaultChainId
          );
        }

        try {
          await this.web3Services.connectChain(dbChain);
          await this.chainService.saveSelectedChainToStorage(dbChain);
          return dbChain;
        } catch (e) {
          assert(false, 'connectionError');
        }

        return dbChain;
      })
    );
  }

  public switchChain(chain: ChainModel) {
    return from(
      this.utilsHelper.async(async () => {
        try {
          await this.web3Services.connectChain(chain);
          await this.chainService.saveSelectedChainToStorage(chain);
          return chain;
        } catch (error) {
          assert(false, 'connectionError');
        }
      })
    );
  }

  public addCustomChain(chain: ChainModel) {
    return from(
      this.utilsHelper.async(async () => {
        try {
          await this.web3Services.connectChain(chain);
          await this.chainService.saveCustomChainToStorage(chain);
          await this.chainService.saveSelectedChainToStorage(chain);
          return chain;
        } catch (error) {
          assert(false, 'connectionError');
        }
      })
    );
  }

  public async getAllChains(): Promise<ChainModel[]> {
    const dbChains = await this.chainService.getCustomChainsFromStorage();

    return [...dbChains, ...this.utilsHelper.chainsJson];
  }
}
