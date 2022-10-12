import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localePt from '@angular/common/locales/pt';

@Injectable()

export class LanguageService {

  public language: string;
  public languages: string[] = [...environment.languages];

  constructor(
    private utilsHelper: UtilsHelper,
    private translate: TranslateService,
  ) {

    registerLocaleData(localeIt, 'it');
    registerLocaleData(localeEs, 'es');
    registerLocaleData(localeFr, 'fr');
    registerLocaleData(localePt, 'pt');
  }

  public init() {
    const language = this.getLanguage();
    this.translate.setDefaultLang(language);
    this.language = language;
  }

  public getLanguages(): LanguageModel[] {
    return environment.languages.map((lang: string) => ({
      lang,
      flag: this.utilsHelper.getLanguagePath(lang.toUpperCase()),
      selected: false,
      label: `LANGUAGE.${lang.toUpperCase()}`
    }));
  }

  public getLanguage(): string {

    let language = environment.defaultLanguage;

    if (window.localStorage && window.localStorage.language) {
      language = window.localStorage.language;
    } else if (this.translate.getBrowserLang()) {
      language = window.localStorage.language;
    }

    const supportedLang = this.languages.find(w => w === language);

    return supportedLang ? supportedLang : environment.defaultLanguage;
  }

  public destroy() {
    window.localStorage.removeItem('language');
  }

  public isSelected(): boolean {
    return window.localStorage.getItem('langSelected') === '1';
  }

  public setLanguage(language: string): boolean {
    this._save(language);
    return true;
  }

  public getTranslate(key: string, params?: any) {

    if (params) {
      return this.translate.instant(key, params);
    }

    return this.translate.instant(key);
  }

  private _save(language: string) {

    if (!language || language === 'undefined' || language === null) {
      return;
    }

    if (window.localStorage.getItem('langSelected') !== '1') {
      window.localStorage.setItem('langSelected', '1');
    }

    window.localStorage.language = language;
    this.translate.use(language);
    this.language = language;

    return language;
  }

}
