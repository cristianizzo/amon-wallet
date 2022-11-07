import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastService {

  constructor(
    private toastController: ToastController,
  ) {
  }

  public responseError(message: string) {

    this.showMessage({
      message,
      position: 'bottom',
      cssClass: 'fail',
    });
  }

  public responseSuccess(message: string) {

    this.showMessage({
      message,
      position: 'top',
      cssClass: 'success',
    });
  }

  public async showMessage({
                             header,
                             message,
                             position,
                             cssClass,
                             buttons,
                             duration = 3000,
                             keyboardClose = true,
                             disableCancel = false,
                           }: any) {

    const mergeButtons = (disableCancel) ? buttons : [...[{text: 'X', role: 'cancel'}], ...buttons || []];

    const toastOption = {
      header,
      message,
      position,
      cssClass,
      duration,
      buttons: mergeButtons,
      keyboardClose
    };

    const toast = await this.toastController.create(toastOption);
    await toast.present();

    return toast;
  }
}

