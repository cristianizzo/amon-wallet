import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from './tabs.routing';
import { TabsComponent } from '@pages/tabs/component/tabs.component';
import { NgAmonPipesModule } from '@pipes/index.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    NgAmonPipesModule,
  ],
  declarations: [TabsComponent],
})
export class TabsPageModule {}
