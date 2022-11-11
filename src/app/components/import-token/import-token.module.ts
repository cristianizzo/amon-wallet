import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ImportTokenComponent } from '@components/import-token/import-token.component';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { FormsModule } from '@angular/forms';
import { NgAmonPipesModule } from '@pipes/index.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    BackButtonModule,
    FormsModule,
    NgAmonPipesModule,
  ],
  exports: [ImportTokenComponent],
  entryComponents: [ImportTokenComponent],
  declarations: [ImportTokenComponent],
})
export class ImportTokenModule {}
