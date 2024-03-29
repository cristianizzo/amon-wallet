import { environment } from '@env/environment';
import { Component } from '@angular/core';
import { UtilsHelper } from '@app/helpers/utils';
import { LanguageService } from '@services/language.service';
import { ThemeService } from '@services/theme.service';
import { ToastService } from '@services/toast.service';
import { WalletModel } from '@app/models';
import { WalletSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { WalletHelper } from '@helpers/wallet';

const logContent = (data) =>
  Object.assign({ service: 'app:wallet:receive' }, data);

@Component({
  selector: 'app-deposit',
  templateUrl: 'deposit.component.html',
  styleUrls: ['deposit.component.scss'],
})
export class DepositComponent {
  public config = environment;
  public wallet: WalletModel;
  public qrCode: string;
  public selectedTheme: string;

  constructor(
    private readonly store: Store<StateModel>,
    private utilsHelper: UtilsHelper,
    private langService: LanguageService,
    private themeService: ThemeService,
    public toastService: ToastService,
    private walletHelper: WalletHelper
  ) {
    this.themeService.theme.subscribe((theme) => (this.selectedTheme = theme));
    this.store.select(WalletSelector.getWallet).subscribe((wallet) => {
      this.wallet = wallet;
      if (wallet) {
        this.getQrCode();
      }
    });
  }

  ionViewWillEnter(): void {}

  ionViewDidLeave(): void {}

  /**
   * Get QrCode function
   */
  getQrCode() {
    try {
      this.qrCode = this.utilsHelper.qrCodeStringify({
        address: this.wallet.address,
      });
    } catch (error) {
      // logger.warn(logContent(Object.assign({}, {
      //   info: 'Error get QrCode',
      //   err: error
      // })));
    }
  }

  /**
   * Copy Address Function
   */
  public copyAddress(wallet: WalletModel) {
    this.walletHelper.copyAddress(wallet.address);
  }

  /**
   * getCoinIcon function
   */
  getIcon(icon: string): string {
    if (this.selectedTheme === 'dark') {
      return `${icon}-dark`;
    }

    return icon;
  }

  /**
   * set price Function
   */
  async shareAddress() {}
}
