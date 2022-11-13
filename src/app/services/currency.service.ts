import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { CurrencyModel } from '@models/index';
import { UtilsHelper } from '@helpers/utils';
import { from, Observable } from 'rxjs';
import { LocalForageService } from '@services/localforage.service';

declare const window: any;

@Injectable()
export class CurrencyService {
  public currencies: CurrencyModel[];

  constructor(
    public utilsHelper: UtilsHelper,
    private localForageService: LocalForageService
  ) {
    this.currencies = [...this.utilsHelper.currenciesJson];
  }

  public initCurrencies(): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        let dbCurrencies: CurrencyModel[] =
          await this.localForageService.getItem('currencies');

        if (!this.utilsHelper.arrayHasValue(dbCurrencies)) {
          dbCurrencies = this.utilsHelper.currenciesJson.map((currency) => {
            currency.default = currency.symbol === environment.defaultCurrency;
            return currency;
          });
          await this.localForageService.setItem('currencies', dbCurrencies);
        }

        return dbCurrencies;
      })
    );
  }

  public get() {
    const currentCurrency = window.localStorage.currency
      ? window.localStorage.currency
      : environment.defaultCurrency;
    return this.currencies.find(
      (currency) => currency.symbol === currentCurrency
    );
  }

  public save(currency: string) {
    if (!currency || currency === 'undefined' || currency === null) {
      return;
    }

    window.localStorage.currency = currency;

    return currency;
  }

  public destroy() {
    window.localStorage.removeItem('currency');
  }
}
