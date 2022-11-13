import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from '@pages/profile/component/profile.component';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ProfileRoutingModule } from '@pages/profile/profile.routing';
import { BackButtonModule } from '@components/back-button/back-button.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ProfileRoutingModule,
    BackButtonModule,
  ],
  declarations: [ProfileComponent],
})
export class ProfileModule {}
