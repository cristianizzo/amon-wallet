import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NetworksComponent } from '@pages/networks/component/networks.component';
import { NetworksRoutingModule } from '@pages/networks/networks.routing';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgAmonPipesModule } from '@pipes/index.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NetworksRoutingModule,
    BackButtonModule,
    NgAmonDirectivesModule,
    TranslateModule,
    NgAmonPipesModule,
  ],
  declarations: [NetworksComponent],
})
export class NetworksModule {}
