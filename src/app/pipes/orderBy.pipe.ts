import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'appOrderBy',
})
export class OrderByPipe implements PipeTransform {
  transform(array: any, args: string, reverse: boolean = false): any {
    if (!array) {
      return [];
    }

    _.cloneDeep(array).sort((a: any, b: any) => {
      if (a[args] < b[args]) {
        return -1;
      } else if (a[args] > b[args]) {
        return 1;
      } else {
        return 0;
      }
    });

    if (reverse) {
      return array.reverse();
    } else {
      return array;
    }
  }
}
