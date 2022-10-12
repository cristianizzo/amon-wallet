import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { OrderBy } from '@pipes/orderBy';
import { DateFormatPipe } from '@pipes/dateFormat';
import { LocaleDatePipe } from '@pipes/localeDate.pipe';
import { FilterPipe } from '@pipes/filter.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    OrderBy,
    DateFormatPipe,
    LocaleDatePipe,
    FilterPipe
  ],
  exports: [
    OrderBy,
    DateFormatPipe,
    LocaleDatePipe,
    FilterPipe
  ],
  providers: [
    DecimalPipe,
    DatePipe
  ],
})

export class NgAmonPipesModule {
}
