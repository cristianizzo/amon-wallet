import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'appFilterArgs',
  pure: false,
})
export class FilterArgsPipe implements PipeTransform {
  transform(items: any[], property: string, value: string): any {
    if (!items || !property || !value) {
      return items;
    }
    return items.filter((item) => item[property].indexOf(value) !== -1);
  }
}
