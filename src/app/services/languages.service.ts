import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilsHelper } from '@helpers/utils';
import { registerLocaleData } from '@angular/common';
import { LanguageModel } from '@models/index';

import localeIt from '@angular/common/locales/it';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localePt from '@angular/common/locales/pt';
import { from, Observable } from 'rxjs';
import { LocalForageService } from '@services/localforage.service';

@Injectable()
export class LanguageService {
  public languages: string[] = [...environment.languages];

  constructor(
    private utilsHelper: UtilsHelper,
    private translate: TranslateService,
    private localForageService: LocalForageService
  ) {
    registerLocaleData(localeIt, 'it');
    registerLocaleData(localeEs, 'es');
    registerLocaleData(localeFr, 'fr');
    registerLocaleData(localePt, 'pt');
  }

  public initLanguages(): Observable<LanguageModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        const defaultLang = this._getLanguage();
        this.translate.use(defaultLang);

        const languages = environment.languages.map((lang: string) => ({
          lang,
          flag: this.utilsHelper.getLanguagePath(lang.toUpperCase()),
          selected: lang === this._getLanguage(),
          label: `LANGUAGE.${lang.toUpperCase()}`,
        }));
        const dbLanguage = languages.find((l) => l.selected);
        window.localStorage.language = dbLanguage.lang;

        return languages;
      })
    );
  }

  public switchLanguage(
    language: LanguageModel,
    languages: LanguageModel[]
  ): Observable<LanguageModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        const updatedLanguages = languages.map((l) =>
          Object.assign({}, l, {
            selected: l.lang === language.lang,
          })
        );
        const dbLanguage = languages.find((l) => l.selected);
        window.localStorage.language = dbLanguage.lang;

        return updatedLanguages;
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

  private _getLanguage() {
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
