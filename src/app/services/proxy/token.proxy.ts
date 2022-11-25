import { Injectable } from '@angular/core';
import { ChainModel, TokenModel, WalletModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { from, Observable } from 'rxjs';
import { WalletService } from '../wallet.service';
import { CryptoHelper } from '@helpers/crypto';
import { TokenService } from '../token.service';
import { Web3Services } from '@services/web3.service';
import * as _ from 'lodash';
import assert from 'assert';
import logger from '@app/app.logger';

const logContent = logger.logContent('service:proxy:token');

@Injectable()
export class TokenProxy {
  constructor(
    private utilsHelper: UtilsHelper,
    private tokenService: TokenService,
    private walletService: WalletService,
    private cryptoHelper: CryptoHelper,
    private web3Services: Web3Services
  ) {}

  public initTokens(
    chain: ChainModel,
    wallet?: WalletModel
  ): Observable<TokenModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        const dbTokens = await this.tokenService.getTokensFromStorage(chain);
        const selectedTokens = dbTokens.filter((w) => w.selected);

        const updatedTokens = await this.utilsHelper.asyncMap(
          selectedTokens,
          async (token) => {
            const balance = await this.web3Services.getTokenBalance(
              token.address,
              wallet.address,
              token.decimals
            );

            token.balance = balance;
            return token;
          },
          (error) => {
            logger.error(
              logContent.add({
                info: `error get token balance`,
                chain,
                error,
              })
            );
          }
        );

        return updatedTokens;
      })
    );
  }

  public addToken(
    address: string,
    wallet: WalletModel,
    chain: ChainModel
  ): Observable<TokenModel> {
    return from(
      this.utilsHelper.async(async () => {
        const token = await this.tokenService.getTokenFromStorage(
          address,
          chain
        );
        assert(!token, 'tokenAlreadyExists');

        const tokenInfo: TokenModel = await this.web3Services.getTokenInfo(
          address,
          wallet.address
        );

        assert(tokenInfo, 'tokenNotFound');

        const newToken = this.tokenService.parseToken(tokenInfo, chain);

        const balance = await this.web3Services.getTokenBalance(
          newToken.address,
          wallet.address,
          newToken.decimals
        );

        newToken.selected = true;
        newToken.balance = balance;

        await this.tokenService.addUpdateTokenToStorage(newToken, chain);

        return newToken;
      })
    );
  }

  public updateToken(
    address: string,
    { symbol, name, decimals },
    wallet: WalletModel,
    chain: ChainModel
  ): Observable<TokenModel> {
    return from(
      this.utilsHelper.async(async () => {
        const token = await this.tokenService.getTokenFromStorage(
          address,
          chain
        );
        assert(token, 'tokenNotFound');

        const balance = await this.web3Services.getTokenBalance(
          token.address,
          wallet.address,
          decimals
        );

        token.selected = true;
        token.balance = balance;
        token.name = name;
        token.symbol = symbol;
        token.decimals = decimals;

        await this.tokenService.addUpdateTokenToStorage(token, chain);

        return token;
      })
    );
  }

  public selectToken(
    address: string,
    wallet: WalletModel,
    chain: ChainModel
  ): Observable<any> {
    return from(
      this.utilsHelper.async(async () => {
        const dbTokens = await this.getAllTokens(chain);
        const dbToken = dbTokens.find((w) => w.address === address);

        if (!dbToken) {
          return this.addToken(address, wallet, chain).toPromise();
        }

        assert(!dbToken.selected, 'tokenAlreadySelected');

        try {
          const balance = await this.web3Services.getTokenBalance(
            dbToken.address,
            wallet.address,
            dbToken.decimals
          );

          dbToken.selected = true;
          dbToken.balance = balance;

          await this.tokenService.addUpdateTokenToStorage(dbToken, chain);

          return dbToken;
        } catch (error) {
          logger.error(
            logContent.add({
              info: `error select token`,
              chain,
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
    chain: ChainModel
  ): Observable<TokenModel> {
    return from(
      this.utilsHelper.async(async () => {
        const allTokens = await this.getAllTokens(chain);
        const dbToken = allTokens.find((w) => w.address === address);

        assert(dbToken && dbToken.selected, 'tokenNotFound');

        try {
          dbToken.selected = false;
          await this.tokenService.addUpdateTokenToStorage(dbToken, chain);
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

  public async loadBalances(tokens: TokenModel[], wallet: WalletModel) {
    return await Promise.all(
      tokens.map(async (token) => {
        try {
          const balance = await this.web3Services.getTokenBalance(
            token.address,
            wallet.address,
            token.decimals
          );

          token.loadBalance = true;
          token.balance = balance;
          return token;
        } catch () {
          return token;
        }
      })
    );
  }

  public async getAllTokens(chain: ChainModel): Promise<TokenModel[]> {
    const dbTokens = await this.tokenService.getTokensFromStorage(chain);
    const defaultChainTokens = (this.utilsHelper.tokensJson[chain.symbol] || [])
      .filter((token) => token.chainId === chain.chainId)
      .map((t) => this.tokenService.parseToken(t, chain));

    return _.unionBy(dbTokens || [], defaultChainTokens || [], 'address');
  }
}
