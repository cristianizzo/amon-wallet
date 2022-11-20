import { Component, Input } from '@angular/core';
import { WalletType } from '@app/models';
import { ToastService } from '@app/services/toast.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-export-wallet',
  templateUrl: './export-wallet.component.html',
  styleUrls: ['./export-wallet.component.scss'],
})
export class ExportWalletComponent {
  @Input() decrypted: string;
  @Input() walletType: WalletType;
  @Input() address: string;
  public step: number;

  constructor(
    private modalCtrl: ModalController,
    private toastService: ToastService
  ) {
    this.step = 1;
  }

  /**
   * Go to step function
   */
  public goToStep(step: number) {
    this.step = step;
  }

  /**
   * copied function
   */
  public copied(_: string) {
    this.toastService.responseSuccess('Copied');
  }

  public downloadBackupWallet() {
    const opts: any = {
      address: this.address,
    };

    if (this.walletType === WalletType.mnemonic) {
      opts.phrase = this.decrypted;
    }

    if (this.walletType === WalletType.privateKey) {
      opts.privateKey = this.decrypted;
    }

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(opts));

    // TODO: on mobile this will not work use capacitor (check amon wallet)
    const downloadBtn = document.createElement('a');
    downloadBtn.setAttribute('href', dataStr);
    downloadBtn.setAttribute('download', 'backup-wallet.json');
    document.body.appendChild(downloadBtn);
    downloadBtn.click();
    downloadBtn.remove();
  }

  /**
   * close function
   */
  public close() {
    this.modalCtrl.dismiss();
  }
}
