import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '@components/loader/loader.component.module';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { SummaryModalComponent } from '@components/summary/summary.component';

@NgModule({
  imports: [IonicModule, CommonModule, LoaderModule, BackButtonModule],
  exports: [SummaryModalComponent],
  declarations: [SummaryModalComponent],
  entryComponents: [SummaryModalComponent],
})
export class SummaryModule {}
