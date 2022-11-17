import { Injectable } from '@angular/core';
import { NetworkModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { from, Observable } from 'rxjs';
import { Web3Services } from '@services/web3.service';
import { LocalForageService } from '@services/localforage.service';
import { environment } from '@env/environment';
import assert from 'assert';

@Injectable()
export class NetworkService {
  constructor(
    private utilsHelper: UtilsHelper,
    private localForageService: LocalForageService,
    private web3Services: Web3Services
  ) {}

  public async getNetworksFromStorage(): Promise<NetworkModel[]> {
    const dbNetworks =
      (await this.localForageService.getItem('networks')) || [];
    return dbNetworks;
  }

  public initNetworks(): Observable<NetworkModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        let dbNetworks = await this.getNetworksFromStorage();

        if (!this.utilsHelper.arrayHasValue(dbNetworks)) {
          dbNetworks = this.utilsHelper.networksJson;

          dbNetworks.map((p) => {
            p.default =
              p.symbol === environment.defaultNetwork &&
              p.chainId === environment.defaultChainId;
            return p;
          });

          await this.localForageService.setItem('networks', dbNetworks);
        }
        await this.web3Services.connectNetwork(
          dbNetworks.find((p) => p.default)
        );
        return dbNetworks;
      })
    );
  }

  public switchNetwork(network: NetworkModel): Observable<NetworkModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        const dbNetworks = await this.getNetworksFromStorage();
        const newNetwork = dbNetworks.find((p) => p.id === network.id);

        dbNetworks.map((p) => {
          p.default = p.id === newNetwork.id;
          return p;
        });

        try {
          await this.web3Services.connectNetwork(
            dbNetworks.find((p) => p.default)
          );
        } catch (error) {
          assert(false, 'connectionError');
        }

        await this.localForageService.setItem('networks', dbNetworks);

        return dbNetworks;
      })
    );
  }
}
