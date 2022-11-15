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
import assert from 'assert';
import logger from '@app/app.logger';

const logContent = logger.logContent('core:effects:token');

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
        let dbTokens = await this.getTokensFromStorage(provider);

        if (!this.utilsHelper.arrayHasValue(dbTokens)) {
          //init tokens
          dbTokens = await this._getInitTokens(provider);
        }

        await this.utilsHelper.asyncMap(
          dbTokens,
          async (token) => {
            await this._addUpdateTokenToStorage(token, provider);
          },
          (error) => {
            logger.error(
              logContent.add({
                info: `error update token to storage`,
                error,
              })
            );
          }
        );

        const dbSelectedTokens = await this._syncSelectedTokensWithCoinGecko(
          wallet,
          provider,
          currency
        );

        await Promise.all([
          dbTokens.map((updatedDbToken) =>
            this._addUpdateTokenToStorage(updatedDbToken, provider)
          ),
          dbSelectedTokens.map((selectedToken) =>
            this._addUpdateTokenToStorage(selectedToken, provider)
          ),
        ]);

        return dbTokens;
      })
    );
  }

  public addToken(
    address: string,
    wallet: WalletModel,
    provider: ProviderModel,
    currency: CurrencyModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        let existingToken = await this._getTokenFromStorage(address, provider);
        assert(!existingToken, 'tokenAlreadyExists');

        try {
          if (!existingToken) {
            existingToken = await this._fetchCustomToken(
              address,
              wallet,
              provider
            );
          }

          const updatedToken = await this._updateCoinGeckoTicker(
            existingToken,
            provider,
            currency
          );

          const balance = await this.web3Services.getTokenBalance(
            updatedToken.address,
            wallet.address
          );

          updatedToken.selected = true;
          updatedToken.balance = balance;

          await this._addUpdateTokenToStorage(updatedToken, provider);

          return updatedToken;
        } catch (error) {
          logger.error(
            logContent.add({
              info: `error add token`,
              provider,
              currency,
              error,
            })
          );
          throw error;
        }
      })
    );
  }

  public selectToken(
    address: string,
    wallet: WalletModel,
    provider: ProviderModel,
    currency: CurrencyModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        const dbToken = await this._getTokenFromStorage(address, provider);
        assert(!dbToken || !dbToken.selected, 'tokenNotFound');

        try {
          const updatedToken = await this._updateCoinGeckoTicker(
            dbToken,
            provider,
            currency
          );

          const balance = await this.web3Services.getTokenBalance(
            updatedToken.address,
            wallet.address
          );

          updatedToken.selected = true;
          updatedToken.balance = balance;

          await this._addUpdateTokenToStorage(updatedToken, provider);

          return updatedToken;
        } catch (error) {
          logger.error(
            logContent.add({
              info: `error select token`,
              provider,
              currency,
              error,
            })
          );
          throw error;
        }
      })
    );
  }

  public unselectToken(
    address: string,
    provider: ProviderModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        const dbToken = await this._getTokenFromStorage(address, provider);
        assert(dbToken && dbToken.selected, 'tokenNotFound');

        try {
          dbToken.selected = false;
          await this._addUpdateTokenToStorage(dbToken, provider);
          return dbToken;
        } catch (error) {
          logger.error(
            logContent.add({
              info: `error unselect token`,
              error,
            })
          );
          throw error;
        }
      })
    );
  }

  private async getTokensFromStorage(
    provider: ProviderModel
  ): Promise<TokenModel[]> {
    const dbTokens =
      (await this.localForageService.getItem(`${provider.symbol}-tokens`)) ||
      [];
    return dbTokens;
  }

  private async _syncSelectedTokensWithCoinGecko(
    wallet: WalletModel,
    provider: ProviderModel,
    currency: CurrencyModel
  ): Promise<TokenModel[]> {
    const dbTokens = await this.getTokensFromStorage(provider);

    const dbSelectedTokens = await this.utilsHelper.asyncMap(
      dbTokens.filter((tk) => tk.selected),
      async (token) => {
        const updatedToken = await this._updateCoinGeckoTicker(
          token,
          provider,
          currency
        );

        if (updatedToken.selected && wallet && wallet.address) {
          const balance = await this.web3Services.getTokenBalance(
            updatedToken.address,
            wallet.address
          );
          updatedToken.balance = balance;
        }

        return updatedToken;
      },
      (error) => {
        logger.error(
          logContent.add({
            info: `error sync selected tokens with coinGecko`,
            provider,
            currency,
            error,
          })
        );
        throw error;
      }
    );

    return dbSelectedTokens;
  }

  private async _addUpdateTokenToStorage(
    token: TokenModel,
    provider: ProviderModel
  ): Promise<TokenModel[]> {
    let dbTokens = await this.getTokensFromStorage(provider);
    const existingToken = dbTokens.find((tk) => tk.address === token.address);

    if (existingToken) {
      dbTokens = dbTokens.map((tk) => {
        if (tk.address === token.address) {
          return Object.assign(tk, token);
        }
        return tk;
      });
    } else {
      dbTokens.push(token);
    }

    await this.localForageService.setItem(
      `${provider.symbol}-tokens`,
      dbTokens
    );

    return dbTokens;
  }

  private async _getTokenFromStorage(
    address: string,
    provider: ProviderModel
  ): Promise<TokenModel> {
    const dbTokens = await this.getTokensFromStorage(provider);
    const token = dbTokens.find((tk) => tk.address === address);
    return token;
  }

  private async _getInitTokens(provider: ProviderModel) {
    const initTokens = this.utilsHelper.tokensJson[provider.symbol] || [];

    const defaultTokens: TokenModel[] = [...initTokens].filter(
      (token) => token.chainId === provider.chainId
    );

    const tokenWithCoinGeckoId =
      await this.coinGeckoService.findTokensCoinGeckoId(defaultTokens);

    const parsedTokens = tokenWithCoinGeckoId.map((t) =>
      this._parseToken(t, provider)
    );

    return parsedTokens;
  }

  private async _fetchCustomToken(
    address: string,
    wallet: WalletModel,
    provider: ProviderModel
  ): Promise<TokenModel> {
    const tokenInfo: TokenModel = await this.web3Services.getTokenInfo(
      address,
      wallet.address
    );

    const tokenWithCoinGeckoId =
      await this.coinGeckoService.findTokensCoinGeckoId([tokenInfo]);

    const parsedTokens = tokenWithCoinGeckoId.map((t) =>
      this._parseToken(t, provider)
    );

    return parsedTokens[0];
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
        image: token.image,
        cryptoPrice: 0,
        fiatPrice: 0,
        priceChange24h: 0,
      };

      return newToken;
    }

    return token;
  }

  private async _updateCoinGeckoTicker(
    token: TokenModel,
    provider: ProviderModel,
    currency: CurrencyModel
  ) {
    if (token && token.coinGeckoId) {
      const ticker = await this.coinGeckoService.getTicker(
        token.coinGeckoId,
        token.symbol
      );

      if (ticker) {
        if (ticker.image && !token.image) {
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
            token.priceChange24h =
              ticker.market_data.price_change_percentage_24h;
          }
        }
      }
    }

    return token;
  }
}
