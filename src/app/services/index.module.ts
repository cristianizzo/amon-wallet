import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EnvModel } from '@app/models';
import { APIService } from '@services/api.service';
import { EnvService } from '@services/config.service';
import { ThemeService } from '@services/theme.service';
import { CurrencyService } from '@services/currency.service';
import { CurrencyProxy } from '@services/proxy/currency.proxy';
import { ErrorService } from '@services/error.service';
import { LanguageService } from '@services/language.service';
import { LanguageProxy } from '@services/proxy/languages.proxy';
import { TempStorageService } from '@services/tempStorage.service';
import { ToastService } from '@services/toast.service';
import { Web3Services } from '@services/web3.service';
import { WalletService } from '@services/wallet.service';
import { WalletProxy } from '@services/proxy/wallet.proxy';
import { ChainService } from '@services/chain.service';
import { ChainProxy } from '@services/proxy/chain.proxy';
import { TokenService } from '@services/token.service';
import { TokenProxy } from '@services/proxy/token.proxy';

import { CoinGeckoService } from '@services/coingecko.service';
import { LocalForageService } from '@services/localforage.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export {
  APIService,
  ErrorService,
  ChainService,
  ChainProxy,
  CoinGeckoService,
  ThemeService,
  CurrencyService,
  CurrencyProxy,
  LanguageService,
  LanguageProxy,
  ToastService,
  TempStorageService,
  LocalForageService,
  Web3Services,
  WalletService,
  WalletProxy,
  TokenService,
  TokenProxy,
};

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) =>
          new TranslateHttpLoader(http, 'assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
  ],
  exports: [TranslateModule],
  providers: [],
  declarations: [],
})
export class NgAmonServicesModule {
  public static forRoot(
    environment: EnvModel
  ): ModuleWithProviders<NgAmonServicesModule> {
    return {
      ngModule: NgAmonServicesModule,
      providers: [
        APIService,
        ErrorService,
        ChainService,
        ChainProxy,
        CoinGeckoService,
        CurrencyService,
        CurrencyProxy,
        LanguageService,
        LanguageProxy,
        ToastService,
        TempStorageService,
        Web3Services,
        WalletService,
        WalletProxy,
        TokenService,
        TokenProxy,
        ThemeService,
        LocalForageService,
        { provide: EnvService, useValue: environment },
      ],
    };
  }
}
