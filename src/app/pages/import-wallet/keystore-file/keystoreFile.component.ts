import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormValidationHelper } from '@helpers/validation-form';
import { TempStorageService } from '@services/tempStorage.service';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { environment } from '@env/environment';
import { ToastService } from '@services/toast.service';
import { LanguageProxy } from '@services/index.module';
import { WalletModel } from '@app/models';
import { WalletActions } from '@app/core/actions';
import { WalletSelector } from '@app/core/selectors';
import { UtilsHelper } from '@helpers/utils';
import { Store } from '@ngrx/store';
import { WalletHelper } from '@helpers/wallet';

@Component({
  selector: 'app-keystore-file',
  templateUrl: 'keystoreFile.component.html',
  styleUrls: ['keystoreFile.component.scss'],
})
export class KeystoreFileComponent {
  public formObj: FormGroup;
  public file: File | null = null;
  constructor(
    private router: Router,
    public navController: NavController,
    private formBuilder: FormBuilder,
    private formValidatorHelper: FormValidationHelper,
    private walletHelper: WalletHelper,
    private tempStorageService: TempStorageService,
    private toastService: ToastService,
    private languageProxy: LanguageProxy,
    private loadingCtrl: LoadingController,
    private utilsHelper: UtilsHelper,
    private store: Store
  ) {
    this.initForm();
  }

  public onFileSelected(event) {
    const file = event.target.files;
    this.file = file && file.item(0);
  }

  public async back() {
    this.formObj.reset();
    await this.navController.navigateForward('/welcome');
  }

  public async importWallet() {
    try {
      const walletName = this.tempStorageService.data
        ? this.tempStorageService.data.walletName
        : `Account ${Math.floor(Math.random() * 100)}`;

      const rawForm = this.formObj.getRawValue();
      const file = await this.file.text();

      const newWallet = await this.walletHelper.importWalletFromEncryptedJson({
        name: walletName,
        walletJson: file,
        password: rawForm.password,
      });

      return newWallet;
    } catch (_) {
      return false;
    }
  }

  public async submit() {
    const newWallet: any = await this.importWallet();
    if (!newWallet) {
      this.toastService.responseError(
        this.languageProxy.getTranslate('ERRORS.PRIVATE_KEY')
      );
      return;
    }

    const existingWallet = await this.walletHelper.walletAlreadyExists(
      newWallet.address
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
      json: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          this.formValidatorHelper.jsonFile.bind(this),
        ])
      ),
      password: new FormControl('', Validators.compose([Validators.required])),
    });
  }
}
