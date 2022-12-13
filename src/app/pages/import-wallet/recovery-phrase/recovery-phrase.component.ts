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
import { WalletModel } from '@app/models';
import { Router } from '@angular/router';
import { TempStorageService } from '@services/tempStorage.service';
import { WalletSelector } from '@app/core/selectors';
import { WalletActions } from '@app/core/actions';
import { ToastService } from '@services/toast.service';
import { LanguageProxy } from '@services/proxy/languages.proxy';
import { WalletHelper } from "@helpers/wallet";

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
    const newWallet = await this.importWallet();

    if (!newWallet) {
      this.toastService.responseError(
        this.languageProxy.getTranslate('ERRORS.SEED_PHRASE')
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

  private async addWallet(wallet: WalletModel, secret: string) {
    this.store.dispatch(WalletActions.addWallet(wallet, secret));
    await this.utilsHelper.wait(3000);

    this.store.select(WalletSelector.getWallet).subscribe((myWallet) => {
      if (myWallet) {
        this.router.navigate(['/auth/derivate-paths']);
      }
    });
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
