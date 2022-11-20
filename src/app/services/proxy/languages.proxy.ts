import { Injectable } from '@angular/core';
import { LanguageModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { from, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';

@Injectable()
export class LanguageProxy {
  constructor(
    private utilsHelper: UtilsHelper,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  public initLanguage(): Observable<LanguageModel> {
    return from(
      this.utilsHelper.async(async () => {
        const defaultLang = this.languageService.getLanguage();
        this.translate.setDefaultLang(defaultLang);

        const language = {
          lang: defaultLang,
          flag: this.utilsHelper.getLanguagePath(defaultLang.toUpperCase()),
          label: `LANGUAGE.${defaultLang.toUpperCase()}`,
        };

        return language;
      })
    );
  }

  public switchLanguage(language: LanguageModel): Observable<LanguageModel> {
    return from(
      this.utilsHelper.async(async () => {
        this.languageService.saveLanguage(language.lang);
        this.translate.use(language.lang);

        if (window.localStorage.getItem('langSelected') !== '1') {
          window.localStorage.langSelected = '1';
        }

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

  public getAllLanguages(): LanguageModel[] {
    const languages = environment.languages.map((lang: string) => ({
      lang,
      flag: this.utilsHelper.getLanguagePath(lang.toUpperCase()),
      label: `LANGUAGE.${lang.toUpperCase()}`,
    }));

    return languages;
  }
}
