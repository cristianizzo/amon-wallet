import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketComponent } from '@pages/market/component/market.component';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { MarketRoutingModule } from '@pages/market/market.routing';
import { BackButtonModule } from '@components/back-button/back-button.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MarketRoutingModule,
    BackButtonModule,
  ],
  declarations: [MarketComponent],
})
export class MarketModule {}
