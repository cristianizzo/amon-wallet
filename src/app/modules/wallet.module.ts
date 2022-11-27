import { Injectable } from '@angular/core';
import { WalletService } from '@services/wallet.service';
import { ErrorService } from '@services/error.service';
import { ToastService } from '@app/services/toast.service';
import { AlertController } from '@ionic/angular';
import { Web3Services } from '@app/services/web3.service';
import { UtilsHelper } from '@helpers/utils';
import { WalletProxy } from '@services/proxy/wallet.proxy';
import { ActionSheetController } from '@ionic/angular';
import { LanguageService } from '@app/services/languages.service';
import { Router } from '@angular/router';

declare const navigator: any;

@Injectable()
export class WalletModule {
  constructor(
    private walletProxy: WalletProxy,
    private walletService: WalletService,
    private errorService: ErrorService,
    private toastService: ToastService,
    private alertController: AlertController,
    private web3Services: Web3Services,
    private utilsHelper: UtilsHelper,
    private actionSheetController: ActionSheetController,
    private langService: LanguageService,
    private router: Router
  ) {}

  public async createWalletFromMnemonic(name: string) {
    const dbWallets = await this.walletProxy.getAllWallets();
    return this.web3Services.getWallet({
      name,
      main: !this.utilsHelper.arrayHasValue(dbWallets),
    });
  }

  public async importWalletFromMnemonic(name: string, mnemonic): Promise<any> {
    try {
      const dbWallets = await this.walletProxy.getAllWallets();
      return this.web3Services.getWallet({
        name,
        mnemonic,
        main: !this.utilsHelper.arrayHasValue(dbWallets),
      });
    } catch (_) {
      return false;
    }
  }

  public async importWalletFromPrivateKey(
    name: string,
    privateKey: string
  ): Promise<any> {
    try {
      const dbWallets = await this.walletProxy.getAllWallets();
      return this.web3Services.getWalletFromPrivateKey({
        name,
        privateKey,
        main: !this.utilsHelper.arrayHasValue(dbWallets),
      });
    } catch (_) {
      return false;
    }
  }

  public async importWalletFromEncryptedJson(
    name: string,
    walletJson: string,
    password: string
  ): Promise<any> {
    try {
      const dbWallets = await this.walletProxy.getAllWallets();
      return this.web3Services.getWalletFromKeyStoreJSON({
        name,
        walletJson,
        password,
        main: !this.utilsHelper.arrayHasValue(dbWallets),
      });
    } catch (_) {
      return false;
    }
  }

  public async exportWallet({ name, mnemonic, privateKey }): Promise<any> {
    try {
      if (mnemonic) {
        return this.web3Services.getWallet({
          name,
          mnemonic,
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

  /**
   * Ask Restore Wallet function
   */
  public async askRestoreWallet() {
    const buttons = [
      {
        text: this.langService.getTranslate('BUTTON.RECOVER_PHRASE'),
        role: 'recovery-phrase',
        cssClass: 'recovery-phrase',
        handler: () => this.router.navigate(['/import-wallet/recovery-phrase']),
      },
      {
        text: this.langService.getTranslate('BUTTON.PRIVATE_KEY'),
        role: 'private-key',
        cssClass: 'private-key',
        handler: () => this.router.navigate(['/import-wallet/private-key']),
      },
      {
        text: this.langService.getTranslate('BUTTON.JSON_FILE'),
        role: 'json-file',
        cssClass: 'json-file',
        handler: () => this.router.navigate(['/import-wallet/keystore-file']),
      },
      {
        text: this.langService.getTranslate('BUTTON.CANCEL'),
        icon: 'close',
        role: 'cancel',
        handler: () => {},
      },
    ];

    const actionSheet = await this.actionSheetController.create({
      header: this.langService.getTranslate('ACTION_SHEET.IMPORT_ACCOUNT'),
      buttons,
    });

    await actionSheet.present();

    return await actionSheet.onDidDismiss();
  }
}
