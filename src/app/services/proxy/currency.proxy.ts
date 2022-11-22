import { Injectable } from '@angular/core';
import { CurrencyModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { from, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CurrencyService } from '../currency.service';

@Injectable()
export class CurrencyProxy {
  constructor(
    private utilsHelper: UtilsHelper,
    private currencyService: CurrencyService
  ) {}

  public initCurrency(): Observable<CurrencyModel> {
    return from(
      this.utilsHelper.async(async () => {
        let dbCurrency =
          await this.currencyService.getSelectedCurrencyFromStorage();

        if (!dbCurrency) {
          dbCurrency = this.utilsHelper.currenciesJson.find(
            (currency) => currency.symbol === environment.defaultCurrency
          );
          await this.currencyService.saveSelectedCurrencyToStorage(dbCurrency);
        }

        return dbCurrency;
      })
    );
  }

  public switchCurrency(currency: CurrencyModel) {
    return from(
      this.utilsHelper.async(async () => {
        const newCurrency = this.utilsHelper.currenciesJson.find(
          (c) => c.symbol === currency.symbol
        );
        await this.currencyService.saveSelectedCurrencyToStorage(newCurrency);

        return newCurrency;
      })
    );
  }

  public async getAllCurrencies(
    currency: CurrencyModel
  ): Promise<CurrencyModel[]> {
    return this.utilsHelper.currenciesJson.map((c) =>
      Object.assign({}, c, {
        selected: c.symbol === currency?.symbol,
      })
    );
  }
}
