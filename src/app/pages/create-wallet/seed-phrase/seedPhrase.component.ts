import { environment } from '@env/environment';
import { Component } from '@angular/core';
import { UtilsHelper } from '@app/helpers/utils';
import { WalletModel } from '@app/models';
import { Router } from '@angular/router';
import { ToastService } from '@app/services/toast.service';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { FormActions, WalletActions } from '@app/core/actions';
import { WalletSelector } from '@app/core/selectors';
import { WalletModule } from '@app/modules/index.module';
import { LanguageProxy, TempStorageService } from '@app/services/index.module';
import { Location } from '@angular/common';

@Component({
  selector: 'app-seed-phrase',
  templateUrl: 'seedPhrase.component.html',
  styleUrls: ['seedPhrase.component.scss'],
})
export class SeedPhraseComponent {
  public step: number;
  public password: string;
  public phrases: string[];
  public payloadClipboard: string;
  public wallet: WalletModel;
  public verifyPhrases: {
    index: number;
    items: { name: string; valid: boolean; answer: boolean }[];
  }[];

  constructor(
    private readonly store: Store<StateModel>,
    private router: Router,
    private utilsHelper: UtilsHelper,
    private toastService: ToastService,
    private tempStorageService: TempStorageService,
    private walletModule: WalletModule,
    private languageProxy: LanguageProxy,
    private location: Location
  ) {
    this.step = 1;
  }

  async ionViewWillEnter() {
    const walletName = this.tempStorageService.data
      ? this.tempStorageService.data.walletName
      : environment.defaultWalletName;
    this.initWallet(walletName);
  }

  /**
   * submit function
   */
  public async submit() {
    const secret =
      this.tempStorageService.data.secret ||
      (await this.walletModule.askWalletSecret());
    const isValidSecret = await this.walletModule.verifyMainWalletSecret(
      secret
    );

    if (!secret || !isValidSecret) {
      this.toastService.responseError(
        this.languageProxy.getTranslate('ERRORS.INVALID_SECRET')
      );
      return false;
    }

    this.store.dispatch(WalletActions.addWallet(this.wallet, secret));
    await this.utilsHelper.wait(3000);

    this.store.select(WalletSelector.getWallet).subscribe((wallet) => {
      if (wallet) {
        this.tempStorageService.data = null;
        this.router.navigate(['/auth/assets']);
      }
    });
  }

  /**
   * disabledSubmit function
   */
  public disabledSubmit() {
    if (this.step === 2) {
      let correctAnswers = 0;
      for (const phrase of this.verifyPhrases) {
        for (const item of phrase.items) {
          if (item.valid && item.answer) {
            correctAnswers++;
          }
        }
      }
      return correctAnswers !== 3;
    }
  }

  /**
   * selectAnswer function
   */
  public selectAnswer(phrase: any, item: any) {
    for (const i of phrase.items) {
      i.answer = i.name === item.name;
    }
  }

  /**
   * copied function
   */
  public copied(_: string) {
    this.toastService.responseSuccess('Copied');
  }

  /**
   * Go to step function
   */
  public goToStep(step: number) {
    this.step = step;
  }

  /**
   * back function
   */
  public async back() {
    if (this.step === 2) {
      this.goToStep(1);
      return;
    }
    this.location.back();
  }

  /**
   * initWallet function
   */
  private async initWallet(walletName: string) {
    this.wallet = await this.walletModule.createWalletFromMnemonic(walletName);
    this.phrases = this.wallet.phrase.split(' ');
    this.verifyPhrases = this.utilsHelper
      .phraseItems(this.phrases.slice(0, 9))
      .sort((a, b) => a.index - b.index);
    this.payloadClipboard = this.phrases.reduce(
      (acc, phrase, index) => (acc += `#${index + 1} ${phrase} \n`),
      ''
    );
  }
}
