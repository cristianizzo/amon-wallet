import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ImportTokenModule } from '@components/import-token/import-token.module';
import { TokensComponent } from '@components/tokens/tokens.component';
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
    ImportTokenModule,
    NgAmonPipesModule,
    NgAmonDirectivesModule,
  ],
  exports: [TokensComponent],
  entryComponents: [],
  declarations: [TokensComponent],
})
export class TokensModule {}
