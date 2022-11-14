import { Injectable } from '@angular/core';
import { ProviderModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { from, Observable } from 'rxjs';
import { Web3Services } from '@services/web3.service';
import { LocalForageService } from '@services/localforage.service';
import { environment } from '@env/environment';
import assert from 'assert';

@Injectable()
export class ProviderService {
  constructor(
    private utilsHelper: UtilsHelper,
    private localForageService: LocalForageService,
    private web3Services: Web3Services
  ) {}

  public async getProvidersFromStorage(): Promise<ProviderModel[]> {
    const dbProviders =
      (await this.localForageService.getItem('providers')) || [];
    return dbProviders;
  }

  public initProviders(): Observable<ProviderModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        let dbProviders = await this.getProvidersFromStorage();

        if (!this.utilsHelper.arrayHasValue(dbProviders)) {
          dbProviders = this.utilsHelper.providersJson;

          dbProviders.map((p) => {
            p.default =
              p.symbol === environment.defaultProvider &&
              p.chainId === environment.defaultChainId;
            return p;
          });

          await this.localForageService.setItem('providers', dbProviders);
        }
        await this.web3Services.connectProvider(
          dbProviders.find((p) => p.default)
        );
        return dbProviders;
      })
    );
  }

  public switchProvider(provider: ProviderModel): Observable<ProviderModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        const dbProviders = await this.getProvidersFromStorage();
        const newProvider = dbProviders.find((p) => p.id === provider.id);

        dbProviders.map((p) => {
          p.default = p.id === newProvider.id;
          return p;
        });

        try {
          await this.web3Services.connectProvider(
            dbProviders.find((p) => p.default)
          );
        } catch (error) {
          assert(false, 'connectionError');
        }

        await this.localForageService.setItem('providers', dbProviders);

        return dbProviders;
      })
    );
  }
}
