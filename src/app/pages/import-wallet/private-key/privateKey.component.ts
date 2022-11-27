import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormValidationHelper } from '@helpers/validation-form';
import { WalletModule } from '@app/modules/wallet.module';
import { TempStorageService } from '@services/tempStorage.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { environment } from '@env/environment';
import { ToastService } from '@services/toast.service';
import { WalletModel } from '@app/models';
import { FormActions, WalletActions } from '@app/core/actions';
import { WalletSelector } from '@app/core/selectors';
import { UtilsHelper } from '@helpers/utils';
import { Store } from '@ngrx/store';
import { LanguageProxy } from '@services/proxy/languages.proxy';

@Component({
  selector: 'app-private-key',
  templateUrl: 'privateKey.component.html',
  styleUrls: ['privateKey.component.scss'],
})
export class PrivateKeyComponent {
  public formObj: FormGroup;

  constructor(
    private router: Router,
    public navController: NavController,
    private formBuilder: FormBuilder,
    private formValidatorHelper: FormValidationHelper,
    private walletModule: WalletModule,
    private tempStorageService: TempStorageService,
    private toastService: ToastService,
    public languageProxy: LanguageProxy,
    private utilsHelper: UtilsHelper,
    private store: Store
  ) {
    this.initForm();
  }

  public async back() {
    this.formObj.reset();
    await this.navController.navigateForward('/welcome');
  }

  public async importWallet() {
    try {
      const walletName = this.tempStorageService.data
        ? this.tempStorageService.data.walletName
        : environment.defaultWalletName;
      const rawForm = this.formObj.getRawValue();

      const newWallet = await this.walletModule.importWalletFromPrivateKey(
        walletName,
        rawForm.privateKey
      );
      return newWallet;
    } catch (_) {
      return false;
    }
  }

  public async submit() {
    const newWallet = await this.importWallet();
    if (!newWallet) {
      this.toastService.responseError(
        this.languageProxy.getTranslate('ERRORS.PRIVATE_KEY')
      );
      return;
    }

    const existingWallet = await this.walletModule.walletAlreadyExists(
      newWallet.address
    );

    if (existingWallet) {
      this.toastService.responseError(
        this.languageProxy.getTranslate('ERRORS.WALLET_ALREADY_EXISTS')
      );
      return;
    }

    const secret = await this.walletModule.askWalletSecret();
    const isValidSecret = await this.walletModule.verifyMainWalletSecret(
      secret
    );

    if (!secret || !isValidSecret) {
      this.toastService.responseError(
        this.languageProxy.getTranslate('ERRORS.INVALID_SECRET')
      );
      return;
    }

    await this.addWallet(newWallet, secret);
  }

  public async addWallet(wallet: WalletModel, secret: string) {
    this.store.dispatch(WalletActions.addWallet(wallet, secret));
    await this.utilsHelper.wait(3000);

    this.store.select(WalletSelector.getWallet).subscribe((myWallet) => {
      if (myWallet) {
        this.router.navigate(['/auth/assets']);
      }
    });
  }

  /**
   * initForm function
   */
  private initForm() {
    this.formObj = this.formBuilder.group({
      privateKey: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          this.formValidatorHelper.privateKey.bind(this.formValidatorHelper),
        ])
      ),
    });
  }
}
