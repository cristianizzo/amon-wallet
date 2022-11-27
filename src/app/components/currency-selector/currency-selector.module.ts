import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CurrencySelectorComponent } from '@components/currency-selector/currency-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgAmonPipesModule } from '@pipes/index.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    NgAmonPipesModule,
    FormsModule,
  ],
  exports: [CurrencySelectorComponent],
  entryComponents: [CurrencySelectorComponent],
  declarations: [CurrencySelectorComponent],
})
export class CurrencySelectorModule {}
