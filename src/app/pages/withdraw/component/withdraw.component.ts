import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UtilsHelper } from '@helpers/utils';
import { ChainSelector, TokenSelector, WalletSelector } from '@core/selectors';
import { Store } from '@ngrx/store';
import { ChainModel, StateModel, TokenModel, WalletModel } from '@app/models';
import { QrcodeScannerComponent } from '@app/components/qrcode-scanner/qrcode.component';

export enum COIN_SELECTOR_SHAPES {
  VERTICAL,
  HORIZONTAL,
  HORIZONTAL_SMALL,
}

@Component({
  selector: 'app-withdraw',
  templateUrl: 'withdraw.component.html',
  styleUrls: ['withdraw.component.scss'],
})
export class WithdrawComponent {
  public shapes = COIN_SELECTOR_SHAPES;
  public chain: ChainModel;
  public wallet: WalletModel;
  public tokens: TokenModel[];
  public formObj: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private utilsHelper: UtilsHelper,
    private store: Store<StateModel>,
    private modalCtrl: ModalController
  ) {
    this.initForm();
  }

  async ionViewWillEnter() {
    this.store
      .select(ChainSelector.getChain)
      .subscribe((chain) => (this.chain = chain));
    this.store
      .select(WalletSelector.getWallet)
      .subscribe((wallet) => (this.wallet = wallet));
    this.store.select(TokenSelector.getSelectedTokens).subscribe((tokens) => {
      this.tokens = tokens;
    });
  }

  /**
   * onPasteAddress Function
   */
  public async onPaste(field: string, extra: boolean) {
    console.log(field, extra);
  }

  public onSelectedWallet() {}

  public askScan() {
    this.scanWebQrCode();
  }

  public submit() {}

  public calcFiatAmount(amount: string) {
    console.log(amount);
  }

  /**
   * setMaxAmount function
   */
  public setMaxAmount() {
    this.formObj.controls.amount.patchValue(this.wallet.balance);
    this.formObj.controls.amount.markAsTouched();
    this.formObj.get('amount').updateValueAndValidity();
    this.formObj.updateValueAndValidity();
  }

  private async scanWebQrCode() {
    const qrcodeScanner = await this.modalCtrl.create({
      id: 'qrcode-scanner',
      component: QrcodeScannerComponent,
      componentProps: {},
    });

    qrcodeScanner.onDidDismiss().then((params) => {
      if (params.data && this.utilsHelper.stringHasValue(params.data.address)) {
        this.formObj.controls.toAddress.patchValue(params.data.address);
        this.formObj.controls.toAddress.markAsTouched();
        this.formObj.updateValueAndValidity();
      }
    });

    await qrcodeScanner.present();
  }

  private initForm() {
    this.formObj = this.formBuilder.group({
      toAddress: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.utilsHelper.regex.address),
        ]),
      ],
      amount: ['', Validators.compose([Validators.required])],
    });
  }
}
