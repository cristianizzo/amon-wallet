import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TotalBalanceComponent } from '@components/total-balance/totalBalance.component';
import { TranslateModule } from '@ngx-translate/core';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { FormsModule } from '@angular/forms';
import { NgAmonPipesModule } from '@pipes/index.module';
import { NgAmonDirectivesModule } from '@directives/index.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    BackButtonModule,
    FormsModule,
    NgAmonPipesModule,
    NgAmonDirectivesModule,
  ],
  exports: [TotalBalanceComponent],
  entryComponents: [],
  declarations: [TotalBalanceComponent],
})
export class TotalBalanceModule {}
