import { Injectable } from '@angular/core';
import { ConfigModel } from '@app/models';
import { LocalForageService } from '@services/localforage.service';
import { UtilsHelper } from '@helpers/utils';
import { ProviderModel } from '@models/provider.model';
import { Web3Services } from '@services/web3.service';

@Injectable()
export class AppConfig {

  private providers: ProviderModel[];
  private readonly config: ConfigModel;

  constructor(
    private localForageService: LocalForageService,
    private web3Services: Web3Services,
    private utilsHelper: UtilsHelper,
  ) {
    this.providers = this.utilsHelper.providersJson;
    this.config = {};
  }

  async loadConfiguration() {

    const provider = await this.localForageService.getItem('provider');

    if (this.utilsHelper.objectHasValue(provider)) {
      // existing configuration
      this.config.provider = provider;
      console.log('existing provider ', this.config);
      return;
    }

    // new configuration
    await this.setProvider(this.providers.find(prov => prov.default));
    console.log('new provider ', this.config);
    this.web3Services.connectProvider(this.config.provider);
  }

  async setProvider(provider: ProviderModel) {
    if (this.utilsHelper.objectHasValue(provider)) {
      this.config.provider = await this.localForageService.setItem('provider', provider);
    }
  }
}
