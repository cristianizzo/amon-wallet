import { environment } from '@env/environment';
import { Component } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormValidationHelper } from '@helpers/validation-form';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { Router } from '@angular/router';
import { TempStorageService } from '@services/tempStorage.service';
import { ToastService } from '@services/toast.service';
import { LanguageProxy } from '@services/proxy/languages.proxy';
import { WalletHelper } from '@helpers/wallet';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-recovery-phrase',
  templateUrl: './recovery-phrase.component.html',
  styleUrls: ['./recovery-phrase.component.scss'],
})
export class RecoveryPhraseComponent {
  public formObj: FormGroup;

  constructor(
    private readonly store: Store<StateModel>,
    private router: Router,
    private formBuilder: FormBuilder,
    private utilsHelper: UtilsHelper,
    private formValidationHelper: FormValidationHelper,
    private walletHelper: WalletHelper,
    private tempStorageService: TempStorageService,
    private toastService: ToastService,
    private loadingController: LoadingController,
    public languageProxy: LanguageProxy
  ) {
    this.initForm();
  }

  ionViewWillEnter(): void {}

  ionViewDidLeave(): void {
    this.formObj.reset();
  }

  async importWallet(): Promise<any> {
    try {
      const walletName = this.tempStorageService.data
        ? this.tempStorageService.data.walletName
        : environment.defaultWalletName;
      const rawForm = this.formObj.getRawValue();

      const newWallet = await this.walletHelper.importWalletFromMnemonic(
        walletName,
        rawForm.seedPhrase
      );
      return newWallet;
    } catch (_) {
      return false;
    }
  }

  /**
   * submit function
   */
  public async submit() {
    const loader = await this.loadingController.create(
      this.utilsHelper.loaderOption()
    );
    await loader.present();

    const newWallet = await this.importWallet();

    if (!newWallet) {
      await loader.dismiss();
      this.toastService.responseError(
        this.languageProxy.getTranslate('ERRORS.SEED_PHRASE')
      );
      return;
    }

    await this.utilsHelper.wait(3000);

    this.tempStorageService.data = newWallet;
    this.router.navigate(['/import-wallet/derivate-paths']);
    loader.dismiss();
  }

  /**
   * initForm function
   */
  private initForm() {
    this.formObj = this.formBuilder.group({
      seedPhrase: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          this.formValidationHelper.mnemonic.bind(this),
        ])
      ),
    });
  }
}
