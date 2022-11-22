import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { OrderByPipe } from '@pipes/orderBy.pipe';
import { OrderByValuePipe } from '@pipes/orderByValue.pipe';
import { DateFormatPipe } from '@pipes/dateFormat.pipe';
import { LocaleDatePipe } from '@pipes/localeDate.pipe';
import { FilterPipe } from '@pipes/filter.pipe';
import { FilterArgsPipe } from '@pipes/filterArgs.pipe';
import { CryptoBalancePipe } from '@pipes/cryptoBalance.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    CryptoBalancePipe,
    OrderByPipe,
    OrderByValuePipe,
    DateFormatPipe,
    LocaleDatePipe,
    FilterPipe,
    FilterArgsPipe,
  ],
  exports: [
    CryptoBalancePipe,
    OrderByPipe,
    OrderByValuePipe,
    DateFormatPipe,
    LocaleDatePipe,
    FilterPipe,
    FilterArgsPipe,
  ],
  providers: [DecimalPipe, DatePipe],
})
export class NgAmonPipesModule {}
