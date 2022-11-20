import { Injectable } from '@angular/core';
import { CurrencyModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { LocalForageService } from '@services/localforage.service';

@Injectable()
export class CurrencyService {
  public currencies: CurrencyModel[];

  constructor(
    public utilsHelper: UtilsHelper,
    private localForageService: LocalForageService
  ) {
  }

  public async getSelectedCurrencyFromStorage(): Promise<CurrencyModel> {
    const dbCurrency = await this.localForageService.getItem('currency');

    return dbCurrency;
  }

  public async saveSelectedCurrencyToStorage(currency: CurrencyModel): Promise<CurrencyModel> {
    await this.localForageService.setItem('currency', currency);

    return currency;
  }
}
