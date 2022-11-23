import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilsHelper } from '@helpers/utils';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss'],
})
export class QrcodeScannerComponent {
  public currentDevice: MediaDeviceInfo = null;
  public hasPermission: boolean;
  public loading: boolean;

  constructor(
    public toastService: ToastService,
    private utilsHelper: UtilsHelper,
    private modalController: ModalController
  ) {
    this.loading = true;
  }

  /**
   * stripeAddress function
   */
  public stripeAddress(barcodeData: string) {
    if (!this.utilsHelper.stringHasValue(barcodeData)) {
      return;
    }

    return barcodeData;
  }

  public async onCodeResult(value: string) {
    if (this.utilsHelper.stringHasValue(value)) {
      this.toastService.responseSuccess('Address scanned');
      await this.modalController.dismiss({ address: value });
    } else {
      this.toastService.responseError('Address not valid');
    }
  }

  public onErrorScan() {
    this.toastService.responseError('Address not valid');
  }

  public async onCameraNotFound() {
    this.toastService.responseError('Camera not found');
    await this.utilsHelper.wait(3000);
    this.continue();
  }

  public onCameraStart(event: any) {
    if (event === false) {
      this.loading = false;
    }
  }

  public onHasPermission(has: boolean): void {
    this.hasPermission = has;
  }

  /**
   * continue function
   */
  public async continue() {
    await this.modalController.dismiss();
  }
}
