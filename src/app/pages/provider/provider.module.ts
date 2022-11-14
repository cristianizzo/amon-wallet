import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProviderComponent } from '@pages/provider/component/provider.component';
import { ProviderRoutingModule } from '@pages/provider/provider.routing';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgAmonPipesModule } from '@pipes/index.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ProviderRoutingModule,
    BackButtonModule,
    NgAmonDirectivesModule,
    TranslateModule,
    NgAmonPipesModule,
  ],
  declarations: [ProviderComponent],
})
export class ProviderModule {}
