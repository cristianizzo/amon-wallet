import { Component, ElementRef, HostListener } from '@angular/core';
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
import { LanguageService } from '@services/languages.service';
import { WalletModel } from '@app/models';
import { WalletActions } from '@app/core/actions';
import { WalletSelector } from '@app/core/selectors';
import { LoadingController } from '@ionic/angular';
import { UtilsHelper } from '@helpers/utils';
import { Store } from '@ngrx/store';

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
    private walletModule: WalletModule,
    private tempStorageService: TempStorageService,
    private toastService: ToastService,
    private langService: LanguageService,
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
        : environment.defaultWalletName;

      const rawForm = this.formObj.getRawValue();

      const newWallet = await this.walletModule.importWalletFromEncryptedJson(
        walletName,
        await this.file.text(),
        rawForm.password
      );
      console.log(newWallet);
      return newWallet;
    } catch (_) {
      return false;
    }
  }

  public async submit() {
    const newWallet = await this.importWallet();
    if (!newWallet) {
      this.toastService.responseError(
        this.langService.getTranslate('ERRORS.PRIVATE_KEY')
      );
      return;
    }

    const existingWallet = await this.walletModule.walletAlreadyExists(
      newWallet.address
    );

    if (existingWallet) {
      this.toastService.responseError(
        this.langService.getTranslate('ERRORS.WALLET_ALREADY_EXISTS')
      );
      return;
    }

    const secret = await this.walletModule.askWalletSecret();
    const isValidSecret = await this.walletModule.verifyMainWalletSecret(
      secret
    );

    if (!secret || !isValidSecret) {
      this.toastService.responseError(
        this.langService.getTranslate('ERRORS.INVALID_SECRET')
      );
      return;
    }

    await this.addWallet(newWallet, secret);
  }

  public async addWallet(wallet: WalletModel, secret: string) {
    const loader = await this.loadingCtrl.create(
      this.utilsHelper.loaderOption()
    );
    await loader.present();

    this.store.dispatch(WalletActions.addWallet(wallet, secret));
    await this.utilsHelper.wait(3000);

    this.store.select(WalletSelector.getWallet).subscribe((myWallet) => {
      loader.dismiss();
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
