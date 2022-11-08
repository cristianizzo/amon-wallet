import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EnvModel } from '@app/models';
import { EnvService } from '@services/config.service';
import { ThemeService } from '@services/theme.service';
import { CurrencyService } from '@services/currency.service';
import { ErrorService } from '@services/error.service';
import { LanguageService } from '@services/languages.service';
import { TempStorageService } from '@services/tempStorage.service';
import { ToastService } from '@services/toast.service';
import { Web3Services } from '@services/web3.service';
import { WalletService } from '@services/wallet.service';
import { ProviderService } from '@services/providers.service';
import { LocalForageService } from '@services/localforage.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export {
  ErrorService,
  ProviderService,
  ThemeService,
  CurrencyService,
  LanguageService,
  ToastService,
  TempStorageService,
  LocalForageService,
  Web3Services,
  WalletService,
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
        ErrorService,
        ProviderService,
        CurrencyService,
        LanguageService,
        ToastService,
        TempStorageService,
        Web3Services,
        WalletService,
        ThemeService,
        LocalForageService,
        { provide: EnvService, useValue: environment },
      ],
    };
  }
}
