import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TokenListComponent } from '@components/import-token/tokens/token-list.component';
import { ImportTokenComponent } from '@components/import-token/import-token.component';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { FormsModule } from '@angular/forms';
import { NgAmonPipesModule } from '@pipes/index.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    BackButtonModule,
    FormsModule,
    NgAmonPipesModule,
    TranslateModule,
  ],
  exports: [ImportTokenComponent, TokenListComponent],
  entryComponents: [ImportTokenComponent, TokenListComponent],
  declarations: [ImportTokenComponent, TokenListComponent],
})
export class ImportTokenModule {}
