import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilsHelper } from '@helpers/utils';
import { registerLocaleData } from '@angular/common';

import localeIt from '@angular/common/locales/it';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localePt from '@angular/common/locales/pt';

@Injectable()
export class LanguageService {
  public languages: string[] = [...environment.languages];

  constructor(
    private utilsHelper: UtilsHelper,
    private translate: TranslateService
  ) {
    registerLocaleData(localeIt, 'it');
    registerLocaleData(localeEs, 'es');
    registerLocaleData(localeFr, 'fr');
    registerLocaleData(localePt, 'pt');
  }

  public getLanguage() {
    let language = null;
    if (this._getLanguageFromStorage()) {
      language = this._getLanguageFromStorage();
    } else if (this._getDefaultBrowserLanguage()) {
      language = this._getDefaultBrowserLanguage();
    } else {
      language = environment.defaultLanguage;
    }

    return this.languages.find((w) => w === language);
  }

  public saveLanguage(lang: string) {
    window.localStorage.language = lang;
  }

  private _getLanguageFromStorage(): string {
    if (window.localStorage && window.localStorage.language) {
      return window.localStorage.language;
    }

    return null;
  }

  private _getDefaultBrowserLanguage(): string {
    if (this.translate.getBrowserLang()) {
      return window.localStorage.language;
    }

    return null;
  }
}
