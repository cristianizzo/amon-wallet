import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { CurrencyModel } from '@models/index';
import { UtilsHelper } from '@helpers/utils';
import { from, Observable } from 'rxjs';
import { LocalForageService } from '@services/localforage.service';

@Injectable()
export class CurrencyService {
  public currencies: CurrencyModel[];

  constructor(
    public utilsHelper: UtilsHelper,
    private localForageService: LocalForageService
  ) {
    this.currencies = [...this.utilsHelper.currenciesJson];
  }

  public initCurrencies(): Observable<CurrencyModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        let dbCurrencies = await this._getCurrenciesFromStorage();

        if (!this.utilsHelper.arrayHasValue(dbCurrencies)) {
          dbCurrencies = this.utilsHelper.currenciesJson.map((currency) => {
            currency.selected = currency.symbol === environment.defaultCurrency;
            return currency;
          });
          await this.localForageService.setItem('currencies', dbCurrencies);
        }

        return dbCurrencies;
      })
    );
  }

  public switchCurrency(currency: CurrencyModel): Observable<CurrencyModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        const dbCurrencies = await this._getCurrenciesFromStorage();

        const updatedCurrencies = dbCurrencies.map((w) =>
          Object.assign(w, {
            selected: w.symbol === currency.symbol,
          })
        );

        await this.localForageService.setItem('currencies', updatedCurrencies);

        return updatedCurrencies;
      })
    );
  }

  private async _getCurrenciesFromStorage(): Promise<CurrencyModel[]> {
    const dbCurrencies =
      (await this.localForageService.getItem('currencies')) || [];

    return dbCurrencies;
  }
}
