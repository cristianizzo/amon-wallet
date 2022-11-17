import { Injectable } from '@angular/core';
import {
  CurrencyModel,
  NetworkModel,
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
    network: NetworkModel,
    currency: CurrencyModel,
    wallet?: WalletModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        let dbTokens = await this.getTokensFromStorage(network);

        if (!this.utilsHelper.arrayHasValue(dbTokens)) {
          //init tokens
          dbTokens = await this._getInitTokens(network);
        }

        await this.utilsHelper.asyncMap(
          dbTokens,
          async (token) => {
            await this._addUpdateTokenToStorage(token, network);
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
          network,
          currency
        );

        await Promise.all([
          dbTokens.map((updatedDbToken) =>
            this._addUpdateTokenToStorage(updatedDbToken, network)
          ),
          dbSelectedTokens.map((selectedToken) =>
            this._addUpdateTokenToStorage(selectedToken, network)
          ),
        ]);

        return dbTokens;
      })
    );
  }

  public addToken(
    address: string,
    wallet: WalletModel,
    network: NetworkModel,
    currency: CurrencyModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        let existingToken = await this._getTokenFromStorage(address, network);
        assert(!existingToken, 'tokenAlreadyExists');

        if (!existingToken) {
          existingToken = await this._fetchCustomToken(
            address,
            wallet,
            network
          );
        }

        const updatedToken = await this._updateCoinGeckoTicker(
          existingToken,
          network,
          currency
        );

          const balance = await this.web3Services.getTokenBalance(
            updatedToken.address,
            wallet.address,
            updatedToken.decimals
          );

        updatedToken.selected = true;
        updatedToken.balance = balance;

        await this._addUpdateTokenToStorage(updatedToken, network);

        return updatedToken;
      })
    );
  }

  public updateToken(
    address: string,
    { symbol, name, decimals },
    wallet: WalletModel,
    network: NetworkModel,
    currency: CurrencyModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        const token = await this._getTokenFromStorage(address, network);
        assert(token, 'tokenNotFound');

        const updatedToken = await this._updateCoinGeckoTicker(
          token,
          network,
          currency
        );

        const balance = await this.web3Services.getTokenBalance(
          updatedToken.address,
          wallet.address,
          decimals,
        );

        updatedToken.selected = true;
        updatedToken.balance = balance;
        updatedToken.name = name;
        updatedToken.symbol = symbol;
        updatedToken.decimals = decimals;

        await this._addUpdateTokenToStorage(updatedToken, network);

        return updatedToken;
      })
    );
  }

  public selectToken(
    address: string,
    wallet: WalletModel,
    network: NetworkModel,
    currency: CurrencyModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        const dbToken = await this._getTokenFromStorage(address, network);
        assert(!dbToken || !dbToken.selected, 'tokenNotFound');

        try {
          const updatedToken = await this._updateCoinGeckoTicker(
            dbToken,
            network,
            currency
          );

          const balance = await this.web3Services.getTokenBalance(
            updatedToken.address,
            wallet.address,
            updatedToken.decimals
          );

          updatedToken.selected = true;
          updatedToken.balance = balance;

          await this._addUpdateTokenToStorage(updatedToken, network);

          return updatedToken;
        } catch (error) {
          logger.error(
            logContent.add({
              info: `error select token`,
              network,
              currency,
              error,
            })
          );

          assert(false, 'selectToken');
        }
      })
    );
  }

  public unselectToken(
    address: string,
    network: NetworkModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        const dbToken = await this._getTokenFromStorage(address, network);
        assert(dbToken && dbToken.selected, 'tokenNotFound');

        try {
          dbToken.selected = false;
          await this._addUpdateTokenToStorage(dbToken, network);
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
    network: NetworkModel
  ): Promise<TokenModel[]> {
    const dbTokens =
      (await this.localForageService.getItem(
        `${network.symbol}-${network.chainId}-tokens`
      )) || [];
    return dbTokens;
  }

  private async _syncSelectedTokensWithCoinGecko(
    wallet: WalletModel,
    network: NetworkModel,
    currency: CurrencyModel
  ): Promise<TokenModel[]> {
    const dbTokens = await this.getTokensFromStorage(network);

    const dbSelectedTokens = await this.utilsHelper.asyncMap(
      dbTokens.filter((tk) => tk.selected),
      async (token) => {
        const updatedToken = await this._updateCoinGeckoTicker(
          token,
          network,
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
            network,
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
    network: NetworkModel
  ): Promise<TokenModel[]> {
    let dbTokens = await this.getTokensFromStorage(network);
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
      `${network.symbol}-${network.chainId}-tokens`,
      dbTokens
    );

    return dbTokens;
  }

  private async _getTokenFromStorage(
    address: string,
    network: NetworkModel
  ): Promise<TokenModel> {
    const dbTokens = await this.getTokensFromStorage(network);
    const token = dbTokens.find((tk) => tk.address === address);
    return token;
  }

  private async _getInitTokens(network: NetworkModel) {
    const initTokens = this.utilsHelper.tokensJson[network.symbol] || [];

    const defaultTokens: TokenModel[] = [...initTokens].filter(
      (token) => token.chainId === network.chainId
    );

    const tokenWithCoinGeckoId =
      await this.coinGeckoService.findTokensCoinGeckoId(defaultTokens);

    const parsedTokens = tokenWithCoinGeckoId.map((t) =>
      this._parseToken(t, network)
    );

    return parsedTokens;
  }

  private async _fetchCustomToken(
    address: string,
    wallet: WalletModel,
    network: NetworkModel
  ): Promise<TokenModel> {
    const tokenInfo: TokenModel = await this.web3Services.getTokenInfo(
      address,
      wallet.address
    );

    const tokenWithCoinGeckoId =
      await this.coinGeckoService.findTokensCoinGeckoId([tokenInfo]);

    const parsedTokens = tokenWithCoinGeckoId.map((t) =>
      this._parseToken(t, network)
    );

    return parsedTokens[0];
  }

  private _parseToken(token: TokenModel, network: NetworkModel): TokenModel {
    if (!token.networkSymbol) {
      const newToken: TokenModel = {
        selected: false,
        coinGeckoId: token.coinGeckoId,
        networkSymbol: network.symbol,
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
    network: NetworkModel,
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
          if (ticker.market_data.current_price[network.symbol.toLowerCase()]) {
            token.cryptoPrice =
              ticker.market_data.current_price[network.symbol.toLowerCase()];
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
