import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExchangeComponent } from '@pages/exchange/component/exchange.component';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ExchangeRoutingModule } from './exchange.routing';
import { BackButtonModule } from '@components/back-button/back-button.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ExchangeRoutingModule,
    BackButtonModule,
  ],
  declarations: [ExchangeComponent],
})
export class ExchangeModule {}
