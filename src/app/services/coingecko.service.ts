import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { APIService } from '@services/api.service';
import { CoingeckoCoinModel, TokenModel } from '@app/models';
import { Observable } from 'rxjs';
import { memoize } from 'lodash';
import { UtilsHelper } from '@helpers/utils';
import logger from '@app/app.logger';

const logContent = logger.logContent('services:coingecko');

@Injectable()
export class CoinGeckoService {
  /**
   * Get all coins function
   *
   * @params {string} coinId
   */
  public allCoins = memoize(
    async () =>
      new Promise(async (resolve) => {
        try {
          const coins = await this.apiService
            .get('coingecko', `/coins/list?include_platform=true`)
            .toPromise();

          resolve(coins);
        } catch (error) {
          logger.error(
            logContent.add({
              info: `error fetch all coins coinGecko`,
              error,
            })
          );
          resolve([]);
        }
      })
  );
  /**
   * Get ticker function
   *
   * @params {string} coinId
   */
  public getTicker = memoize(
    async (coinId: string, symbol: string) =>
      new Promise(async (resolve) => {
        try {
          const ticker = await this.apiService
            .get('coingecko', `/coins/${coinId}?market_data=true`)
            .toPromise();

          resolve(ticker);
        } catch (error) {
          logger.warn(
            logContent.add({
              info: `error fetch ticker coinGecko`,
              error,
              coinId,
              symbol,
            })
          );
          resolve(null);
        }
      })
  );

  constructor(
    private apiService: APIService,
    public utilsHelper: UtilsHelper
  ) {}

  public async findTokensCoinGeckoId(defaultTokens: TokenModel[]) {
    const allCoinGeckoCoins = await this.allCoins();

    const tokens = await this.utilsHelper.asyncMap(
      defaultTokens,
      async (token) => {
        const coin = allCoinGeckoCoins.find(
          (cg) => cg.symbol.toLowerCase() === token.symbol.toLowerCase()
        );

        if (coin) {
          token.coinGeckoId = coin.id;
        }

        return token;
      },
      (error) => {
        logger.error(
          logContent.add({
            info: `error find token coinGecko`,
            error,
          })
        );
      }
    );

    return tokens.filter((token) => token.coinGeckoId);
  }

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
    // eslint-disable-next-line @typescript-eslint/naming-convention
  ): Observable<{ total_volumes: any; market_caps: any; prices: any }> {
    return this.apiService.get(
      'coingecko',
      `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
  }
}
