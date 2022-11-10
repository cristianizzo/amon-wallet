import { Injectable } from '@angular/core';
import { WalletService } from '@services/wallet.service';
import { ErrorService } from '@services/error.service';
import { ToastService } from '@app/services/toast.service';
import { AlertController } from '@ionic/angular';
import { Web3Services } from '@app/services/web3.service';
import { UtilsHelper } from '@helpers/utils';
import { WalletModel } from '@app/models';

declare const navigator: any;

@Injectable()
export class WalletModule {
  constructor(
    private walletService: WalletService,
    private errorService: ErrorService,
    private toastService: ToastService,
    private alertController: AlertController,
    private web3Services: Web3Services,
    private utilsHelper: UtilsHelper
  ) {}

  public async createWalletFromMnemonic(name: string) {
    const dbWallets = await this.walletService.getWalletsFromStorage();
    return this.web3Services.getWallet({
      name,
      main: !this.utilsHelper.arrayHasValue(dbWallets),
    });
  }

  public async importWalletFromMnemonic(name: string, mnemonic): Promise<any> {
    try {
      const dbWallets = await this.walletService.getWalletsFromStorage();
      return this.web3Services.getWallet({
        name,
        mnemonic,
        main: !this.utilsHelper.arrayHasValue(dbWallets),
      });
    } catch (_) {
      return false;
    }
  }

  public async importWalletFromPrivateKey(name: string, privateKey: string): Promise<any> {
    try {
      const dbWallets = await this.walletService.getWalletsFromStorage();
      return this.web3Services.getWalletFromPrivateKey({
        name,
        privateKey,
        main: !this.utilsHelper.arrayHasValue(dbWallets),
      });
    } catch (_) {
      return false;
    }
  }


  public async exportWallet({name, mnemonic, privateKey}): Promise<any> {
    try{
      if( mnemonic ) {
        return this.web3Services.getWallet({
          name,
          mnemonic,
        });
      }
      else {
        return this.web3Services.getWalletFromPrivateKey({
          name,
          privateKey,
        });
      }
    }
    catch (_) {
      return false;
    }
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

    const dbWallets = await this.walletService.getWalletsFromStorage();
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
}
