import { Injectable } from '@angular/core';
import { WalletService } from '@services/wallet.service';
import { ErrorService } from '@services/error.service';
import { ToastService } from '@app/services/toast.service';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { Web3Services } from '@app/services/web3.service';
import { UtilsHelper } from '@helpers/utils';
import { WalletProxy } from '@services/proxy/wallet.proxy';
import { Router } from '@angular/router';
import { LanguageProxy } from '@app/services/index.module';
import { WalletModel } from '@app/models';
import { SummaryModalComponent } from '@components/summary/summary.component';

declare const navigator: any;

@Injectable()
export class WalletHelper {
  constructor(
    private walletProxy: WalletProxy,
    private walletService: WalletService,
    private errorService: ErrorService,
    private toastService: ToastService,
    private alertController: AlertController,
    private web3Services: Web3Services,
    private utilsHelper: UtilsHelper,
    private actionSheetController: ActionSheetController,
    private languageProxy: LanguageProxy,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  public async exportWallet({
    name,
    mnemonic,
    privateKey,
    derivationPath,
  }: {
    name: string;
    mnemonic?: string;
    privateKey: string;
    derivationPath?: string;
  }): Promise<any> {
    try {
      if (mnemonic) {
        return this.web3Services.getWallet({
          name,
          mnemonic,
          derivationPath,
        });
      } else {
        return this.web3Services.getWalletFromPrivateKey({
          name,
          privateKey,
        });
      }
    } catch (_) {
      return false;
    }
  }

  public async askDeleteWallet(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const buttons = [
        {
          role: 'cancel',
          text: 'No',
          handler: () => resolve(false),
        },
        {
          text: 'Yes',
          handler: () => resolve(true),
        },
      ];

      const alert = await this.alertController.create({
        header: 'Delete Wallet?',
        buttons,
      });

      await alert.present();
    });
  }

  public async askWalletName(): Promise<string> {
    return new Promise(async (resolve) => {
      const buttons = [
        {
          role: 'cancel',
          text: 'Cancel',
          handler: () => resolve(null),
        },
        {
          text: 'Confirm',
          handler: (data) => resolve(data.accountName),
        },
      ];

      const alert = await this.alertController.create({
        header: 'Account name',
        buttons,
        inputs: [
          {
            name: 'accountName',
            placeholder: 'Name',
            type: 'text',
            min: 3,
            attributes: {
              autocomplete: 'off',
            },
          },
        ],
      });

      await alert.present();
    });
  }

  /**
   * Ask Wallet Secret function
   */
  public async askWalletSecret(opts?: {
    canCancel?: boolean;
  }): Promise<string> {
    return new Promise(async (resolve) => {
      const buttons = [
        {
          text: 'Confirm',
          handler: (data) => resolve(data.secret),
        },
      ];

      if (opts && opts.canCancel) {
        buttons.unshift({
          text: 'Cancel',
          handler: () => resolve(null),
        });
      }

      // TODO: move text
      const alert = await this.alertController.create({
        header: 'Please enter your password',
        buttons,
        inputs: [
          {
            name: 'secret',
            placeholder: 'Password',
            type: 'password',
            min: 4,
          },
        ],
      });

      await alert.present();
    });
  }

  /**
   * Ask Restore Wallet function
   */
  public async askRestoreWallet({
    seed = false,
    privateKey = false,
    json = false,
  }) {
    const buttons = [];

    if (seed) {
      buttons.push({
        text: this.languageProxy.getTranslate('BUTTON.RECOVER_PHRASE'),
        role: 'recovery-phrase',
        cssClass: 'recovery-phrase',
        handler: () => this.router.navigate(['/import-wallet/recovery-phrase']),
      });
    }

    if (privateKey) {
      buttons.push({
        text: this.languageProxy.getTranslate('BUTTON.PRIVATE_KEY'),
        role: 'private-key',
        cssClass: 'private-key',
        handler: () => this.router.navigate(['/import-wallet/private-key']),
      });
    }

    if (json) {
      buttons.push({
        text: this.languageProxy.getTranslate('BUTTON.JSON_FILE'),
        role: 'json-file',
        cssClass: 'json-file',
        handler: () => this.router.navigate(['/import-wallet/keystore-file']),
      });
    }

    buttons.push({
      text: this.languageProxy.getTranslate('BUTTON.CANCEL'),
      icon: 'close',
      role: 'cancel',
      handler: () => {},
    });

    const actionSheet = await this.actionSheetController.create({
      header: this.languageProxy.getTranslate('ACTION_SHEET.IMPORT_ACCOUNT'),
      buttons,
    });

    await actionSheet.present();

    return await actionSheet.onDidDismiss();
  }

  public async importWalletFromMnemonic(
    name: string,
    mnemonic: string,
    derivationPath?: string
  ): Promise<WalletModel | boolean> {
    try {
      return this.walletProxy.importMainWalletFromMnemonic({
        name,
        mnemonic,
        derivationPath,
      });
    } catch (_) {
      return false;
    }
  }

  public async importWalletFromEncryptedJson({
    name,
    walletJson,
    password,
  }): Promise<WalletModel | boolean> {
    try {
      const dbWallets = await this.walletProxy.getAllWallets();
      return this.web3Services.getWalletFromKeyStoreJSON({
        name,
        walletJson,
        password,
        main: !this.utilsHelper.arrayHasValue(dbWallets),
        derivationPath: undefined,
      });
    } catch (_) {
      return false;
    }
  }

  /**
   * Verify Main Wallet Secret function
   */
  public async verifyMainWalletSecret(secret: string): Promise<boolean> {
    if (!secret) {
      return false;
    }

    const dbWallets = await this.walletProxy.getAllWallets();
    const existingWallet = this.utilsHelper.arrayHasValue(dbWallets)
      ? dbWallets.find((w) => w.main)
      : null;

    if (!existingWallet) {
      return true;
    }

    try {
      await this.walletService.decryptWallet({
        wallet: existingWallet,
        secret,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  public async walletAlreadyExists(address: string): Promise<boolean> {
    return this.walletService.walletAlreadyExists(address);
  }

  /**
   * Copy Address Function
   */
  public copyAddress(address: string) {
    navigator.clipboard.writeText(address);
    this.toastService.responseSuccess('Copied');
  }

  public async openSummary(): Promise<any> {
    return new Promise(async (resolve) => {
      const reviewWithdrawModal = await this.modalCtrl.create({
        id: 'summary-modal',
        component: SummaryModalComponent,
        cssClass: ['account-menu'],
        backdropDismiss: true,
        canDismiss: true,
      });

      reviewWithdrawModal.onDidDismiss().then(async (params) => {
        if (params.data && params.data.next) {
          resolve(params.data);
        }
        resolve(false);
      });

      await reviewWithdrawModal.present();
    });
  }
}
