import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { APIService } from '@services/api.service';
import { CoingeckoCoinModel } from '@app/models';
import { Observable } from 'rxjs';
import { memoize } from 'lodash';

@Injectable()
export class CoinGeckoService {
  /**
   * Get all coins function
   *
   * @params {string} coinId
   */
  public allCoins = memoize(async () => {
    return this.apiService
      .get('coingecko', `/coins/list?include_platform=true`)
      .toPromise();
  });

  /**
   * Get ticker function
   *
   * @params {string} coinId
   */
  public getTicker = memoize(async (coinId: string) => {
    return this.apiService
      .get('coingecko', `/coins/${coinId}?market_data=true`)
      .toPromise();
  });

  constructor(private apiService: APIService) {}

  /**
   * Global markets function
   *
   * @params {string} currencyCode
   * @params {string} offset
   * @params {string} limit
   */
  public getMarkets({
    currencyCode = environment.defaultCurrency,
    offset = 1,
    limit = 200,
  }): Observable<CoingeckoCoinModel[]> {
    return this.apiService.get(
      'coingecko',
      `/coins/markets?vs_currency=${currencyCode}&order=market_cap_desc&per_page=${limit}&page=${offset}`
    );
  }

  /**
   * Get tickers by ids function
   *
   * @params {string} currencyCode
   * @params {string} offset
   * @params {string} limit
   * @params {string} ids
   */
  public getByTickers({
    currencyCode = environment.defaultCurrency,
    offset = 1,
    limit = 200,
    ids = '',
  }): Observable<CoingeckoCoinModel[]> {
    return this.apiService.get(
      'coingecko',
      `/coins/markets?order=market_cap&page=${offset}&per_page=${limit}&vs_currency=${currencyCode}&ids=${ids}`
    );
  }

  /**
   * Get Crypto Graph function
   *
   * @params {string} coinId
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public getGraph(
    coinId: string,
    days = 1
  ): Observable<{ total_volumes: any; market_caps: any; prices: any }> {
    return this.apiService.get(
      'coingecko',
      `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
  }
}
