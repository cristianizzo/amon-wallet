import { Component } from '@angular/core';
import { StateModel, WalletModel } from '@app/models';
import { AlertController } from '@ionic/angular';
import { WalletSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { WalletActions } from '@core/actions';
import { LanguageProxy, ToastService, WalletProxy } from '@app/services/index.module';
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
  public search: string;
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
  ) {
    this.offset = 0;
    this.limit = 10;
  }

  async ionViewWillEnter() {
    this.store.select(WalletSelector.getWallet).subscribe((wallet) => {
      this.wallet = wallet;
      if (wallet) {
        this.getWallets();
      }
    });
  }

  async getWallets() {
    this.wallets = await this.walletProxy.getWalletWithDerivatePaths(
      this.offset,
      this.limit
    );
    console.log(this.wallets);
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
