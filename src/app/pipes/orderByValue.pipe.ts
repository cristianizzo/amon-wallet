import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appOrderByValue',
})
export class OrderByValuePipe implements PipeTransform {
  transform(
    array: any,
    prop: string,
    value: any,
    reverse: boolean = false
  ): any {
    if (!array) {
      return [];
    }

    array = [
      ...array.filter((x) => x[prop] === value),
      ...array.filter((x) => x[prop] !== value),
    ];

    if (reverse) {
      return array.reverse();
    } else {
      return array;
    }
  }
}
