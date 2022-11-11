import { Injectable } from '@angular/core';
import {
  CurrencyModel,
  ProviderModel,
  TokenModel,
  WalletModel,
} from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { from, Observable } from 'rxjs';
import { LocalForageService } from '@services/localforage.service';
import { CoinGeckoService } from './coingecko.service';
import { Web3Services } from './web3.service';

@Injectable()
export class TokenService {
  public tokens: TokenModel[];

  constructor(
    public utilsHelper: UtilsHelper,
    private web3Services: Web3Services,
    private localForageService: LocalForageService,
    private coinGeckoService: CoinGeckoService
  ) {}

  public initTokens(
    provider: ProviderModel,
    currency: CurrencyModel,
    wallet?: WalletModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        let dbTokens: TokenModel[] = await this.localForageService.getItem(
          'tokens'
        );

        // existing tokens
        if (this.utilsHelper.arrayHasValue(dbTokens)) {
          dbTokens = await Promise.all(
            dbTokens
              .filter(
                (token) =>
                  token.providerSymbol === provider.symbol &&
                  token.chainId === provider.chainId
              )
              .map(async (token) =>
                this._pairToken(token, provider, currency, wallet)
              )
          );
        } else {
          // init tokens

          const allTokens = [
            ...this.utilsHelper.tokensJson[provider.symbol],
          ].filter((token) => token.chainId === provider.chainId);

          dbTokens = await Promise.all(
            allTokens.map((token) =>
              this._pairToken(token, provider, currency, wallet)
            )
          );
        }

        await this.localForageService.setItem('tokens', dbTokens);

        return dbTokens;
      })
    );
  }

  public addToken(token: TokenModel, wallet: WalletModel): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        const balance = await this.web3Services.getTokenBalance(
          token.address,
          wallet.address
        );

        token.selected = true;
        token.balance = balance;
        return token;
      })
    );
  }

  private async _pairCoinGeckoTokenId(token: TokenModel): Promise<TokenModel> {
    if (!token.coinGeckoId) {
      const allCoins = await this.coinGeckoService.allCoins();
      const coin = allCoins.find(
        (cg) => cg.symbol.toLowerCase() === token.symbol.toLowerCase()
      );

      if (coin) {
        token.coinGeckoId = coin.id;
      } else {
        // TODO: log error
        console.log('coingecko coin not found');
        return null;
      }
    }

    return token;
  }

  private _parseToken(token: TokenModel, provider: ProviderModel): TokenModel {
    if (!token.providerSymbol) {
      const newToken: TokenModel = {
        selected: false,
        coinGeckoId: token.coinGeckoId,
        providerSymbol: provider.symbol,
        address: token.address,
        chainId: token.chainId,
        decimals: token.decimals,
        name: token.name,
        type: token.type,
        symbol: token.symbol,
        balance: '0',
        image: null,
        cryptoPrice: 0,
        fiatPrice: 0,
        priceChange24h: 0,
      };

      return newToken;
    }

    return token;
  }

  private async _pairCoinGeckoTicker(
    token: TokenModel,
    provider: ProviderModel,
    currency: CurrencyModel
  ) {
    const ticker = await this.coinGeckoService.getTicker(token.coinGeckoId);

    if (ticker.image) {
      token.image = ticker.image;
    }

    if (ticker.market_data && ticker.market_data.current_price) {
      if (ticker.market_data.current_price[provider.symbol.toLowerCase()]) {
        token.cryptoPrice =
          ticker.market_data.current_price[provider.symbol.toLowerCase()];
      }

      if (ticker.market_data.current_price[currency.symbol.toLowerCase()]) {
        token.fiatPrice =
          ticker.market_data.current_price[currency.symbol.toLowerCase()];
      }

      if (ticker.market_data.price_change_percentage_24h) {
        token.priceChange24h = ticker.market_data.price_change_percentage_24h;
      }
    }

    return token;
  }

  private async _pairToken(
    token: TokenModel,
    provider: ProviderModel,
    currency: CurrencyModel,
    wallet: WalletModel
  ) {
    try {
      let newToken = await this._pairCoinGeckoTokenId(token);
      newToken = this._parseToken(newToken, provider);

      if (newToken.coinGeckoId) {
        newToken = await this._pairCoinGeckoTicker(
          newToken,
          provider,
          currency
        );
      }

      if (wallet && newToken.selected) {
        const balance = await this.web3Services.getTokenBalance(
          newToken.address,
          wallet.address
        );
        newToken.balance = balance;
      }

      return newToken;
    } catch (error) {
      console.log('error fetch token', token);
      console.log(error);
    }
  }
}
