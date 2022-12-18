import { Component } from '@angular/core';
import { StateModel, WalletModel } from '@app/models';
import { AlertController } from '@ionic/angular';
import { WalletSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { WalletActions } from '@core/actions';
import {
  LanguageProxy,
  TempStorageService,
  ToastService,
  WalletProxy,
} from '@app/services/index.module';
import { UtilsHelper } from '@helpers/utils';
import { WalletHelper } from '@helpers/wallet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-derivate-paths',
  templateUrl: './derivate-paths.component.html',
  styleUrls: ['./derivate-paths.component.scss'],
})
export class DerivatePathsComponent {
  public offset: number;
  public limit: number;
  public perPage: number;
  public loading: boolean;
  public wallet: WalletModel;
  public wallets: WalletModel[];

  constructor(
    private alertController: AlertController,
    private languageProxy: LanguageProxy,
    private store: Store<StateModel>,
    private walletProxy: WalletProxy,
    private walletHelper: WalletHelper,
    private toastService: ToastService,
    private utilsHelper: UtilsHelper,
    private router: Router,
    private tempStorageService: TempStorageService
  ) {
    this.offset = 0;
    this.limit = 10;
    this.perPage = 10;
  }

  async ionViewWillEnter() {
    this.offset = 0;
    this.limit = 10;
    this.perPage = 10;
    this.loading = true;

    this.wallet = this.tempStorageService.data;

    if (this.wallet) {
      this.getWallets();
    } else {
      this.store.select(WalletSelector.getWallet).subscribe((wallet) => {
        this.wallet = wallet;
        if (wallet) {
          this.getWallets();
        }
      });
    }
  }

  async getWallets() {
    this.wallets = await this.walletProxy.getWalletWithDerivatePaths(
      this.offset,
      this.limit,
      this.wallet
    );
    this.loading = false;
  }

  /**
   * selectWallet function
   */
  public async selectWallet(wallet: WalletModel) {
    const existingWallet = await this.walletHelper.walletAlreadyExists(
      wallet.address
    );

    if (existingWallet) {
      this.toastService.responseError(
        this.languageProxy.getTranslate('ERRORS.WALLET_ALREADY_EXISTS')
      );
      return;
    }

    const secret = await this.walletHelper.askWalletSecret();
    const isValidSecret = await this.walletHelper.verifyMainWalletSecret(
      secret
    );

    if (!secret || !isValidSecret) {
      this.toastService.responseError(
        this.languageProxy.getTranslate('ERRORS.INVALID_SECRET')
      );
      return;
    }
    await this.addWallet(wallet, secret);
  }

  /**
   * parseAddress Function
   */
  public parseAddress(address: string) {
    if (address) {
      return `${address.slice(0, 7)}...${address.slice(address.length - 4)}`;
    }
  }

  public prev() {
    this.loading = true;
    this.offset = this.offset - this.perPage;
    this.limit = this.limit - this.perPage;
    this.getWallets();
  }

  public next() {
    this.loading = true;
    this.offset = this.offset + this.perPage;
    this.limit = this.limit + this.perPage;
    this.getWallets();
  }

  private async addWallet(wallet: WalletModel, secret: string) {
    this.store.dispatch(WalletActions.addWallet(wallet, secret));
    await this.utilsHelper.wait(3000);

    this.store.select(WalletSelector.getWallet).subscribe((myWallet) => {
      if (myWallet) {
        this.router.navigate(['/auth/assets']);
      }
    });
  }
}
