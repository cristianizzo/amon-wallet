import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Erc20Component } from '@components/tokens/erc20/erc20.component';
import { Erc721Component } from '@components/tokens/erc721/erc721.component';

import { TranslateModule } from '@ngx-translate/core';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { FormsModule } from '@angular/forms';
import { NgAmonPipesModule } from '@pipes/index.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { LoaderModule } from '@components/loader/loader.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    BackButtonModule,
    FormsModule,
    NgAmonPipesModule,
    NgAmonDirectivesModule,
    LoaderModule,
  ],
  exports: [Erc721Component, Erc20Component],
  entryComponents: [],
  declarations: [Erc721Component, Erc20Component],
})
export class TokensModule {}
