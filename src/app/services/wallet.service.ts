import { Injectable } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import { CryptoHelper } from '@helpers/crypto';
import { LocalForageService } from '@services/localforage.service';
import { EncryptedDataModel, WalletModel, WalletType } from '@app/models';
import { from, Observable } from 'rxjs';
import { Web3Services } from '@services/web3.service';
import assert from 'assert';

@Injectable()
export class WalletService {
  constructor(
    private utilsHelper: UtilsHelper,
    private localForageService: LocalForageService,
    private cryptoHelper: CryptoHelper,
    private web3Services: Web3Services
  ) {}

  public initWallets(): Observable<WalletModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallets = await this.getWalletsFromStorage();
        const walletsWithBalance = await this.fetchBalances(
          dbWallets
        ).toPromise();
        return walletsWithBalance;
      })
    );
  }

  public fetchBalances(wallets: WalletModel[]): Observable<WalletModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        const walletsWithBalance = await Promise.all(
          wallets.map(async (wallet) => await this.fetchBalance(wallet))
        );
        return walletsWithBalance;
      })
    );
  }

  public async cryptWallet({ seedPhrase, secret }): Promise<any> {
    const encrypted = await this.cryptoHelper.encrypt(seedPhrase, secret);
    return encrypted;
  }

  public addWallet({ wallet, secret }): Observable<WalletModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallets = await this.getWalletsFromStorage();
        const existingWallet = dbWallets.find(
          (w) => w.address === wallet.address
        );
        assert(!existingWallet, 'walletAlreadyExists');
        const isPrivateKeyWallet = wallet.walletType === WalletType.privkey;
        let encrypted;

        if (!isPrivateKeyWallet) {
          encrypted = await this.cryptWallet({
            seedPhrase: wallet.phrase,
            secret,
          });
        }

        if (isPrivateKeyWallet) {
          encrypted = await this.cryptoHelper.encrypt(
            wallet.privateKey,
            secret,
            false
          );
        }

        assert(encrypted, 'failEncrypt');

        await this.verifyEncryption(encrypted, secret, !isPrivateKeyWallet);

        dbWallets.push({
          main: dbWallets.length === 0,
          name: wallet.name,
          address: wallet.address,
          basePath: wallet.basePath,
          walletType: wallet.walletType,
          signerType: wallet.signerType,
          isHardware: wallet.isHardware,
          encrypted,
        });

        const updatedWallets = dbWallets.map((w) =>
          Object.assign(w, {
            connected: w.address === wallet.address,
          })
        );

        await this.localForageService.setItem('wallets', updatedWallets);

        const walletsWithBalance = await this.fetchBalances(
          updatedWallets
        ).toPromise();
        return walletsWithBalance;
      })
    );
  }

  public deleteWallet({ address }): Observable<WalletModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallets = await this.getWalletsFromStorage();
        assert(
          dbWallets.find((w) => w.address === address),
          'notFound'
        );
        const updatedWallet: WalletModel[] = dbWallets.filter(
          (wallet) => wallet.address !== address
        );
        await this.localForageService.setItem('wallets', updatedWallet);
        return updatedWallet;
      })
    );
  }

  public renameWallet({ address, name }): Observable<WalletModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallets = await this.getWalletsFromStorage();
        assert(
          dbWallets.find((w) => w.address === address),
          'notFound'
        );

        const updatedWallets: WalletModel[] = dbWallets.reduce(
          (acc, wallet) => {
            if (wallet.address === address) {
              wallet.name = name;
            }
            return [...acc, wallet];
          },
          []
        );

        await this.localForageService.setItem('wallets', updatedWallets);

        const walletsWithBalance = await this.fetchBalances(
          updatedWallets
        ).toPromise();
        return walletsWithBalance;
      })
    );
  }

  public async walletAlreadyExists(address: string): Promise<boolean> {
    const dbWallets = await this.getWalletsFromStorage();
    const existingWallet = this.utilsHelper.arrayHasValue(dbWallets)
      ? dbWallets.find((w) => w.address === address)
      : null;
    return !!existingWallet;
  }

  public hasWallet(): Observable<boolean> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallets = await this.getWalletsFromStorage();
        return dbWallets.length > 0;
      })
    );
  }

  public async decryptWallet({ wallet, secret }): Promise<WalletModel> {
    const decrypted = await this.cryptoHelper.decrypt(
      wallet.encrypted,
      secret,
      !(wallet.walletType === WalletType.privkey)
    );
    assert(decrypted, 'failDecrypt');
    return Object.assign({}, wallet, {
      privateKey: decrypted,
      phrase: decrypted,
    });
  }

  public async getWalletsFromStorage(): Promise<WalletModel[]> {
    const dbWallets = (await this.localForageService.getItem('wallets')) || [];

    return dbWallets;
  }

  private verifyEncryption(
    encrypted: EncryptedDataModel,
    secret: string,
    isPrivateKeyWallet: boolean
  ): Promise<boolean> {
    return this.utilsHelper.async(async () => {
      const decrypted = await this.cryptoHelper.decrypt(
        encrypted,
        secret,
        isPrivateKeyWallet
      );
      assert(decrypted, 'failVerifyEncryption');
      return true;
    });
  }

  private async fetchBalance(wallet: WalletModel): Promise<WalletModel> {
    const balance = await this.web3Services.getBalance(wallet.address);
    return Object.assign({}, wallet, {
      balance,
    });
  }
}
