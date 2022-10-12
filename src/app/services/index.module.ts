import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EnvModel } from '@app/models';
import { EnvService } from '@services/config.service';
import { ThemeService } from '@services/theme.service';
import { CurrencyService } from '@services/currency.service';
import { LanguageService } from '@services/languages.service';
import { ToastService } from '@services/toast.service';
import { Web3Services } from '@services/web3.service';
import { LocalForageService } from '@services/localforage.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export {
  ThemeService,
  CurrencyService,
  LanguageService,
  ToastService,
  LocalForageService,
  Web3Services,
};

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, 'assets/i18n/', '.json'),
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    TranslateModule
  ],
  providers: [],
  declarations: [],
})

export class NgAmonServicesModule {

  public static forRoot(environment: EnvModel): ModuleWithProviders<NgAmonServicesModule> {

    return {
      ngModule: NgAmonServicesModule,
      providers: [
        CurrencyService,
        LanguageService,
        ToastService,
        Web3Services,
        ThemeService,
        LocalForageService,
        {provide: EnvService, useValue: environment}
      ]
    };
  }
}
