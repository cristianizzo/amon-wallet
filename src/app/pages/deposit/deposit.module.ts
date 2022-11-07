import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepositComponent } from '@pages/deposit/component/deposit.component';
import { DepositRoutingModule } from '@pages/deposit/deposit.routing';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { TranslateModule } from '@ngx-translate/core';
import { QrCodeModule } from '@components/qrcode/qrcode.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DepositRoutingModule,
    BackButtonModule,
    NgAmonDirectivesModule,
    TranslateModule,
    QrCodeModule
  ],
  declarations: [DepositComponent]
})
export class DepositModule {
}
