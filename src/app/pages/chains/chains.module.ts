import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChainsComponent } from '@pages/chains/component/chains.component';
import { ChainsRoutingModule } from '@pages/chains/chains.routing';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgAmonPipesModule } from '@pipes/index.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ChainsRoutingModule,
    BackButtonModule,
    NgAmonDirectivesModule,
    TranslateModule,
    NgAmonPipesModule,
  ],
  declarations: [ChainsComponent],
})
export class ChainsModule {}
