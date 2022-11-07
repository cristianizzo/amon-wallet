import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QrCodeComponent} from '@components/qrcode/qrcode.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    QrCodeComponent
  ],
  declarations: [QrCodeComponent]
})

export class QrCodeModule {
}
