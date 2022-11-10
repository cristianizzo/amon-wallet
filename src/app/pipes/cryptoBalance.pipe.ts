import { Pipe, PipeTransform } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'cryptoBalance',
})
export class CryptoBalancePipe implements PipeTransform {
  constructor(
    private utilsHelper: UtilsHelper,
    private decimalPipe: DecimalPipe
  ) {}

  public transform(
    value: string,
    decimal: number = 8,
    forceDefault?: boolean,
    split?: boolean
  ): string {
    if (!value) {
      return value || '0.00';
    }

    const parts = value.toString().split('.');

    if (parts && parts[1] && parts[1].length > 2) {
      if (forceDefault) {
        decimal = 8;
      }

      const newValue = this.utilsHelper.cryptoPrecision(value, decimal);

      if (split) {
        const newParts = newValue.toString().split('.');
        return `${this.decimalPipe.transform(
          newParts[0],
          '1.0-0'
        )}<span class="decimals">.${newParts[1] || '00'}</span>`;
      }

      return newValue;
    } else {
      if (split) {
        return `${this.decimalPipe.transform(
          parts[0],
          '1.0-0'
        )}<span class="decimals">.${parts[1] || '00'}</span>`;
      }

      return this.decimalPipe.transform(value, '1.2-2');
    }
  }
}
