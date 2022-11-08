import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NftsComponent } from '@pages/nfts/component/nfts.component';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { NftsRoutingModule } from '@pages/nfts/nfts.routing';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    NftsRoutingModule,
  ],
  declarations: [NftsComponent],
})
export class NftsPageModule {}
