import { Injectable } from '@angular/core';
import { ProviderModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { from, Observable } from 'rxjs';
import { Web3Services } from '@services/web3.service';
import { LocalForageService } from '@services/localforage.service';

@Injectable()

export class ProviderService {

  constructor(
    private utilsHelper: UtilsHelper,
    private localForageService: LocalForageService,
    private web3Services: Web3Services,
  ) {
  }

  public initProviders(): Observable<any> {

    return from(this.utilsHelper.async(async () => {

      let dbProviders: ProviderModel[] = await this.localForageService.getItem('providers');

      if (!this.utilsHelper.arrayHasValue(dbProviders)) {
        dbProviders = this.utilsHelper.providersJson;
        await this.localForageService.setItem('providers', dbProviders);
      }
      await this.web3Services.connectProvider(dbProviders.find(p => p.default));
      return dbProviders;
    }));
  }
}
