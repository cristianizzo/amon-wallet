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
import { WalletModule } from '@app/modules/index.module';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { WalletModel } from '@app/models';
import { Router } from '@angular/router';
import { TempStorageService } from '@services/tempStorage.service';
import { WalletSelector } from '@app/core/selectors';
import { FormActions, WalletActions } from '@app/core/actions';
import { ToastService } from '@services/toast.service';
import { LanguageService } from '@services/languages.service';

@Component({
  selector: 'app-recovery-phrase',
  templateUrl: './recovery-phrase.component.html',
  styleUrls: ['./recovery-phrase.component.scss'],
})
export class RecoveryPhraseComponent {
  public selectedTheme: string;
  public formObj: FormGroup;
  public wallets: WalletModel[];

  constructor(
    private readonly store: Store<StateModel>,
    private router: Router,
    private formBuilder: FormBuilder,
    private utilsHelper: UtilsHelper,
    private formValidationHelper: FormValidationHelper,
    private walletModule: WalletModule,
    private tempStorageService: TempStorageService,
    private toastService: ToastService,
    private langService: LanguageService
  ) {
    this.initForm();
  }

  ionViewWillEnter(): void {
    this.store
      .select(WalletSelector.getWallets)
      .subscribe((wallets) => (this.wallets = wallets));
  }

  ionViewDidLeave(): void {
    this.formObj.reset();
  }

  async importWallet(): Promise<any> {
    try {
      const walletName = this.tempStorageService.data
        ? this.tempStorageService.data.walletName
        : environment.defaultWalletName;
      const rawForm = this.formObj.getRawValue();

      const newWallet = await this.walletModule.importWalletFromMnemonic(
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
        this.langService.getTranslate('ERRORS.SEED_PHRASE')
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
    this.store.dispatch(FormActions.setLoading({ loading: true }));
    this.store.dispatch(WalletActions.addWallet(wallet, secret));
    await this.utilsHelper.wait(3000);

    this.store.select(WalletSelector.getWallet).subscribe((myWallet) => {
      if (myWallet) {
        this.store.dispatch(FormActions.setLoading({ loading: false }));
        this.router.navigate(['/auth/assets']);
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
