import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { environment } from '@env/environment';
import { UtilsHelper } from '@helpers/utils';
import { BehaviorSubject, from, Observable } from 'rxjs';

declare const window: any;
declare const document: any;

@Injectable()
export class ThemeService {

  public theme: Observable<string>;
  private theme$ = new BehaviorSubject<string>(null);

  constructor(
    private utilsHelper: UtilsHelper
  ) {
    this.theme = this.theme$.asObservable();
  }

  public init(): Observable<any> {
    return from(this.utilsHelper.async(async () => {
      const theme = this.getTheme();
      this._setTheme(theme);
      return theme;
    }));
  }

  public getTheme(): string {

    const theme = window.localStorage.theme;

    if (this.utilsHelper.notNull(theme)) {
      return theme;
    }

    if (window.matchMedia) {

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

      if (prefersDark) {
        this.saveTheme('dark');
        return 'dark';
      }
    }

    this.saveTheme('light');
    return 'light';
  }

  public saveTheme(theme: string = environment.theme): string {

    window.localStorage.theme = theme;
    this._setTheme(theme);
    return theme;
  }

  private _setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('platform', Capacitor.getPlatform());
    this.theme$.next(theme);
  }
}
