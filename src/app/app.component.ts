import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AppConfig } from './app.config';
import { environment } from '@env/environment';
import logger from '@app/app.logger';
import { Web3Services } from '@services/web3.service';

const logContent = logger.logContent('app:root');

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AmonComponent {
  constructor(
    private platform: Platform,
    private appConfig: AppConfig,
    private web3Services: Web3Services,
  ) {
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(async () => {
      this.appConfig.loadConfiguration();

      // for (let index of [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) {
      //
      //   const wallet = this.web3Services.getWallet({
      //     name: `test+${index}`,
      //     mnemonic: 'romance tornado buddy traffic arrive someone elder poet small toe solve behave',
      //     main: false,
      //     // derivationPath: /privkey/
      //     derivationPath: `m/44'/60'/0'/0/${index}`
      //   });
      //   console.log({
      //     derivationPath:  `m/44'/60'/0'/0/${index}`,
      //     address:  wallet.address,
      //   });
      // }

      logger.info(
        logContent.add({
          info: `app running on ${environment.host} - env: ${environment.env}`,
        })
      );
    });
  }
}
