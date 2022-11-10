import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WithdrawComponent } from '@pages/withdraw/component/withdraw.component';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { WithdrawRoutingModule } from '@pages/withdraw/withdraw.routing';
import { BackButtonModule } from '@components/back-button/back-button.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    WithdrawRoutingModule,
    BackButtonModule,
  ],
  declarations: [WithdrawComponent],
})
export class WithdrawModule {}
