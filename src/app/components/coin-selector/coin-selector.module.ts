import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoinSelectorComponent } from '@components/coin-selector/coin-selector.component';

@NgModule({
  imports: [IonicModule, CommonModule, TranslateModule],
  exports: [CoinSelectorComponent],
  entryComponents: [CoinSelectorComponent],
  declarations: [CoinSelectorComponent],
})
export class CoinSelectorModule {
}
