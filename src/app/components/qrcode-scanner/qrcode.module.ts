import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { QrcodeScannerComponent } from '@components/qrcode-scanner/qrcode.component';
// import {ZXingScannerModule} from '@zxing/ngx-scanner';
import { ZXingScannerModule } from '@components/ngx-scanner/zxing-scanner.module';
import { LoaderModule } from '@components/loader/loader.component.module';
import { BackButtonModule } from '@components/back-button/back-button.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ZXingScannerModule,
    LoaderModule,
    BackButtonModule,
  ],
  exports: [QrcodeScannerComponent],
  declarations: [QrcodeScannerComponent],
  entryComponents: [QrcodeScannerComponent],
})
export class QrcodeScannerModule {}
