import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilsHelper } from '@app/helpers/utils';
import { NavController } from '@ionic/angular';
import { Web3Services } from '@app/services/web3.service';
import { WalletModel } from '@app/models';
import { Router } from '@angular/router';
import { CryptoHelper } from '@helpers/crypto';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-recovery-phrase',
  templateUrl: 'recoveryPhrase.index.html',
  styleUrls: ['recoveryPhrase.style.scss'],
})
export class RecoveryPhraseComponent {

  public step: number;
  public password: string;
  public phrases: string[];
  public payloadClipboard: string;
  public wallet: WalletModel;
  public formObj: FormGroup;
  public regexPasswordValidation: any = this.utilsHelper.regex.password;
  public verifyPhrases: { index: number; items: { name: string; valid: boolean; answer: boolean }[] }[];

  constructor(
    private router: Router,
    public navController: NavController,
    private formBuilder: FormBuilder,
    private utilsHelper: UtilsHelper,
    private cryptoHelper: CryptoHelper,
    private web3Services: Web3Services,
    private toastService: ToastService,
  ) {
    this.step = 1;
  }

  async ionViewWillEnter() {
    this.wallet = this.web3Services.createWalletFromMnemonic('EVM Account 1');
    this.phrases = this.wallet.phrase.split(' ');
    this.verifyPhrases = this.utilsHelper.phraseItems(this.phrases.slice(0, 9))
      .sort((a, b) => a.index - b.index);
    console.log('mnemonic: ', this.wallet.phrase);
    console.log('verifyPhrases: ', this.verifyPhrases);

    this.payloadClipboard = this.phrases
      .reduce((acc, phrase, index) => acc += `${index + 1}- ${phrase} \n`, '');
  }

  /**
   * submit function
   */
  public async submit() {
    const encrypted = await this.cryptoHelper.encrypt(this.wallet.phrase, '05May1986!');

    const decrypted = await this.cryptoHelper.decrypt(encrypted, '05May1986!');
    console.log('decrypted: ', decrypted);
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
      i.answer = false;
    }
    item.answer = true;
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
    await this.navController.navigateForward('/pick-password');
  }
}
