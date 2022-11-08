import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetsComponent } from '@pages/assets/component/assets.component';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AssetsRoutingModule } from '@pages/assets/assets.routing';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule } from '@components/header/header.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AssetsRoutingModule,
    TranslateModule,
    HeaderModule,
  ],
  declarations: [AssetsComponent],
})
export class AssetsModule {}
