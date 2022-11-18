import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilsHelper } from '@helpers/utils';
import { registerLocaleData } from '@angular/common';

import localeIt from '@angular/common/locales/it';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localePt from '@angular/common/locales/pt';
import { from, Observable } from 'rxjs';

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

  public initLanguages() {
    return from(
      this.utilsHelper.async(async () => {
        const defaultLang = this.getLanguage();
        this.translate.use(defaultLang);
        return environment.languages.map((lang: string) => ({
          lang,
          flag: this.utilsHelper.getLanguagePath(lang.toUpperCase()),
          selected: lang === this.getLanguage(),
          label: `LANGUAGE.${lang.toUpperCase()}`,
        }));
      })
    );
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

  public saveLanguage(language: string): Observable<string> {
    return from(
      this.utilsHelper.async(async () => {
        if (!language || language === 'undefined' || language === null) {
          return this.getLanguage();
        }

        if (window.localStorage.getItem('langSelected') !== '1') {
          window.localStorage.setItem('langSelected', '1');
        }
        window.localStorage.language = language;
        this.translate.use(language);

        return language;
      })
    );
  }

  public isSelected(): boolean {
    return window.localStorage.getItem('langSelected') === '1';
  }

  public getTranslate(key: string, params?: any) {
    if (params) {
      return this.translate.instant(key, params);
    }

    return this.translate.instant(key);
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
