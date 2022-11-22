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

  public async getTokensFromStorage(chain: ChainModel): Promise<TokenModel[]> {
    const dbTokens =
      (await this.localForageService.getItem(
        `${chain.symbol}-${chain.chainId}-tokens`
      )) || [];
    return dbTokens;
  }

  public async addUpdateTokenToStorage(
    token: TokenModel,
    chain: ChainModel
  ): Promise<TokenModel> {
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

    return token;
  }

  public async getTokenFromStorage(
    address: string,
    chain: ChainModel
  ): Promise<TokenModel> {
    const dbTokens = await this.getTokensFromStorage(chain);
    const token = dbTokens.find((tk) => tk.address === address);
    return token;
  }

  public parseToken(token: TokenModel, chain: ChainModel): TokenModel {
    const newToken = Object.assign(
      {
        selected: token.selected || false,
        coinGeckoId: token.coinGeckoId,
        chainSymbol: chain.symbol,
        address: token.address,
        chainId: token.chainId,
        decimals: token.decimals,
        name: token.name,
        type: token.type,
        symbol: token.symbol,
        balance: token.balance || '0',
        image: token.image,
        cryptoPrice: 0,
        fiatPrice: 0,
        priceChange24h: 0,
      },
      token
    );

    return newToken;
  }

  public async _getInitTokens(chain: ChainModel) {
    const initTokens = this.utilsHelper.tokensJson[chain.symbol] || [];

    const defaultTokens: TokenModel[] = [...initTokens].filter(
      (token) => token.chainId === chain.chainId
    );

    const tokenWithCoinGeckoId =
      await this.coinGeckoService.findTokensCoinGeckoId(defaultTokens);

    const parsedTokens = tokenWithCoinGeckoId.map((t) =>
      this.parseToken(t, chain)
    );

    return parsedTokens;
  }

  public async _updateCoinGeckoTicker(
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
