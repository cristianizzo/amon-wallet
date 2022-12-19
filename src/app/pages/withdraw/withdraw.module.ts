import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WithdrawComponent } from '@pages/withdraw/component/withdraw.component';
import { WithdrawRoutingModule } from '@pages/withdraw/withdraw.routing';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { LoaderModule } from '@components/loader/loader.component.module';
import { QrcodeScannerModule } from '@app/components/qrcode-scanner/qrcode.module';
import { CoinSelectorModule } from '@components/coin-selector/coin-selector.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    WithdrawRoutingModule,
    BackButtonModule,
    TranslateModule,
    NgAmonDirectivesModule,
    ReactiveFormsModule,
    LoaderModule,
    QrcodeScannerModule,
    CoinSelectorModule,
  ],
  declarations: [WithdrawComponent],
})
export class WithdrawModule {}
