import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'appFilter',
  pure: false
})

export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param items list to be filtered ex: [{coin: {code: 'eth', name: 'Ethereum'}}]
   * @param searchText string where we can check list items contains it ex: 'eth'
   * @param searchKeys array of search path in item ['coin.code', 'coin.name']
   * @returns filtered items
   */
  transform(items: any[], searchText: string, searchKeys?: any[]): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase();
    return items.filter((item: any) => searchKeys.some(key => _.get(item, key.split('.')).toLocaleLowerCase().includes(searchText)));
  }
}
