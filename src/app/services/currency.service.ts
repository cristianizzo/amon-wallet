import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { CurrencyModel } from '@models/index';
import { UtilsHelper } from '@helpers/utils';

declare const window: any;

@Injectable()
export class CurrencyService {
  public currencies: CurrencyModel[];

  constructor(public utilsHelper: UtilsHelper) {
    this.currencies = [...this.utilsHelper.currenciesJson];
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
