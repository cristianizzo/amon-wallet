import { Injectable } from '@angular/core';
import {
  CurrencyModel,
  ChainModel,
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
    chain: ChainModel,
    currency: CurrencyModel,
    wallet?: WalletModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        let dbTokens = await this.getTokensFromStorage(chain);

        if (!this.utilsHelper.arrayHasValue(dbTokens)) {
          //init tokens
          dbTokens = await this._getInitTokens(chain);
        }

        await this.utilsHelper.asyncMap(
          dbTokens,
          async (token) => {
            await this._addUpdateTokenToStorage(token, chain);
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
          chain,
          currency
        );

        await Promise.all([
          dbTokens.map((updatedDbToken) =>
            this._addUpdateTokenToStorage(updatedDbToken, chain)
          ),
          dbSelectedTokens.map((selectedToken) =>
            this._addUpdateTokenToStorage(selectedToken, chain)
          ),
        ]);

        return dbTokens;
      })
    );
  }

  public addToken(
    address: string,
    wallet: WalletModel,
    chain: ChainModel,
    currency: CurrencyModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        let existingToken = await this._getTokenFromStorage(address, chain);
        assert(!existingToken, 'tokenAlreadyExists');

        if (!existingToken) {
          existingToken = await this._fetchCustomToken(address, wallet, chain);
        }

        const updatedToken = await this._updateCoinGeckoTicker(
          existingToken,
          chain,
          currency
        );

        const balance = await this.web3Services.getTokenBalance(
          updatedToken.address,
          wallet.address,
          updatedToken.decimals
        );

        updatedToken.selected = true;
        updatedToken.balance = balance;

        await this._addUpdateTokenToStorage(updatedToken, chain);

        return updatedToken;
      })
    );
  }

  public updateToken(
    address: string,
    { symbol, name, decimals },
    wallet: WalletModel,
    chain: ChainModel,
    currency: CurrencyModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        const token = await this._getTokenFromStorage(address, chain);
        assert(token, 'tokenNotFound');

        const updatedToken = await this._updateCoinGeckoTicker(
          token,
          chain,
          currency
        );

        const balance = await this.web3Services.getTokenBalance(
          updatedToken.address,
          wallet.address,
          decimals
        );

        updatedToken.selected = true;
        updatedToken.balance = balance;
        updatedToken.name = name;
        updatedToken.symbol = symbol;
        updatedToken.decimals = decimals;

        await this._addUpdateTokenToStorage(updatedToken, chain);

        return updatedToken;
      })
    );
  }

  public selectToken(
    address: string,
    wallet: WalletModel,
    chain: ChainModel,
    currency: CurrencyModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        const dbToken = await this._getTokenFromStorage(address, chain);
        assert(!dbToken || !dbToken.selected, 'tokenNotFound');

        try {
          const updatedToken = await this._updateCoinGeckoTicker(
            dbToken,
            chain,
            currency
          );

          const balance = await this.web3Services.getTokenBalance(
            updatedToken.address,
            wallet.address,
            updatedToken.decimals
          );

          updatedToken.selected = true;
          updatedToken.balance = balance;

          await this._addUpdateTokenToStorage(updatedToken, chain);

          return updatedToken;
        } catch (error) {
          logger.error(
            logContent.add({
              info: `error select token`,
              chain,
              currency,
              error,
            })
          );

          assert(false, 'selectToken');
        }
      })
    );
  }

  public unselectToken(address: string, chain: ChainModel): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        const dbToken = await this._getTokenFromStorage(address, chain);
        assert(dbToken && dbToken.selected, 'tokenNotFound');

        try {
          dbToken.selected = false;
          await this._addUpdateTokenToStorage(dbToken, chain);
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

  private async getTokensFromStorage(chain: ChainModel): Promise<TokenModel[]> {
    const dbTokens =
      (await this.localForageService.getItem(
        `${chain.symbol}-${chain.chainId}-tokens`
      )) || [];
    return dbTokens;
  }

  private async _syncSelectedTokensWithCoinGecko(
    wallet: WalletModel,
    chain: ChainModel,
    currency: CurrencyModel
  ): Promise<TokenModel[]> {
    const dbTokens = await this.getTokensFromStorage(chain);

    const dbSelectedTokens = await this.utilsHelper.asyncMap(
      dbTokens.filter((tk) => tk.selected),
      async (token) => {
        const updatedToken = await this._updateCoinGeckoTicker(
          token,
          chain,
          currency
        );

        if (updatedToken.selected && wallet && wallet.address) {
          const balance = await this.web3Services.getTokenBalance(
            updatedToken.address,
            wallet.address,
            updatedToken.decimals
          );
          updatedToken.balance = balance;
        }

        return updatedToken;
      },
      (error) => {
        logger.error(
          logContent.add({
            info: `error sync selected tokens with coinGecko`,
            chain,
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
    chain: ChainModel
  ): Promise<TokenModel[]> {
    let dbTokens = await this.getTokensFromStorage(chain);
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
      `${chain.symbol}-${chain.chainId}-tokens`,
      dbTokens
    );

    return dbTokens;
  }

  private async _getTokenFromStorage(
    address: string,
    chain: ChainModel
  ): Promise<TokenModel> {
    const dbTokens = await this.getTokensFromStorage(chain);
    const token = dbTokens.find((tk) => tk.address === address);
    return token;
  }

  private async _getInitTokens(chain: ChainModel) {
    const initTokens = this.utilsHelper.tokensJson[chain.symbol] || [];

    const defaultTokens: TokenModel[] = [...initTokens].filter(
      (token) => token.chainId === chain.chainId
    );

    const tokenWithCoinGeckoId =
      await this.coinGeckoService.findTokensCoinGeckoId(defaultTokens);

    const parsedTokens = tokenWithCoinGeckoId.map((t) =>
      this._parseToken(t, chain)
    );

    return parsedTokens;
  }

  private async _fetchCustomToken(
    address: string,
    wallet: WalletModel,
    chain: ChainModel
  ): Promise<TokenModel> {
    const tokenInfo: TokenModel = await this.web3Services.getTokenInfo(
      address,
      wallet.address
    );

    const tokenWithCoinGeckoId =
      await this.coinGeckoService.findTokensCoinGeckoId([tokenInfo]);

    const parsedTokens = tokenWithCoinGeckoId.map((t) =>
      this._parseToken(t, chain)
    );

    return parsedTokens[0];
  }

  private _parseToken(token: TokenModel, chain: ChainModel): TokenModel {
    if (!token.chainSymbol) {
      const newToken: TokenModel = {
        selected: false,
        coinGeckoId: token.coinGeckoId,
        chainSymbol: chain.symbol,
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
    chain: ChainModel,
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
          if (ticker.market_data.current_price[chain.symbol.toLowerCase()]) {
            token.cryptoPrice =
              ticker.market_data.current_price[chain.symbol.toLowerCase()];
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
